const Redis = require('ioredis')
// const redis = new Redis()
let redis;
const CustomError = require('../errors/CustomError');

class RedisModel {

    static async #changeDBindex(index) {
        if (index < 16 && index >= 0) {
            await redis.select(index)
        }
    }

    static async addUser(id, data) {
        await this.#changeDBindex(0)
        try {
            redis.hmset(`user:${id}`, data)
            return data
        }
        catch (error) {
            throw new CustomError(500, 'redis: inserting new user failed')
        }

    }

    static async updateUser(id, data) {
        await this.#changeDBindex(0)
        try {
            for (const [key, value] of Object.entries(data)) {
                await redis.hset(`user:${id}`, key, value)
            }
            let updatedUser = redis.hgetall(`user:${id}`)
            return updatedUser
        }
        catch (error) {
            throw new CustomError(500, 'redis: updating user failed')
        }
    }

    static async getUser(id) {
        await this.#changeDBindex(0)
        try {
            return (await redis.exists(`user:${id}`) ? await redis.hgetall(`user:${id}`) : undefined)
        }
        catch (error) {
            throw new CustomError(500, 'redis: retrieving user failed')
        }
    }

    static async getUsers() {
        await this.#changeDBindex(0)
        const pattern = 'user:';
        try {
            const keys = await this.getKeys(pattern)
            const userPromises = keys.map(key => redis.hgetall(key)); // Assuming user data is stored in hashes
            const allUsers = await Promise.all(userPromises);
            return allUsers
        }
        catch (error) {
            throw new CustomError(500, 'redis: retrieving all users failed')
        }

    }

    static async addParent(id, parentID) {
        await this.#changeDBindex(1)
        try {
            await redis.set(`parent:${id}`, parentID)
            return { id: parentID }
        }
        catch (error) {
            throw new CustomError(500, 'redis: inserting new parentID failed')
        }
    }

    static async updateParent(id, parentID) {
        await this.#changeDBindex(1)
        try {
            await redis.set(`parent:${id}`, parentID)
            return { id: parentID }
        }
        catch (error) {
            throw new CustomError(500, 'redis: updating parentID failed')
        }
    }

    static async getParent(id) {
        await this.#changeDBindex(1)
        try {
            let parent = await redis.get(`parent:${id}`)
            return parent
        }

        catch (error) {
            throw new CustomError(500, 'redis: retrieving parentID failed')
        }
    }

    static async getParents() {
        await this.#changeDBindex(1)
        const pattern = 'parent:*';
        try {
            const keys = await this.getKeys(pattern)
            const userPromises = keys.map(key => redis.get(key));
            const parents = await Promise.all(userPromises);
            return parents
        }
        catch (error) {
            throw new CustomError(500, 'redis: retrieving all users failed')
        }
    }

    static async isDatabaseEmpty(index) {
        try {
            this.#changeDBindex(index)
            const dbSize = await redis.dbsize()
            return dbSize === 0
        } catch (error) {
            throw new CustomError(500, 'redis: checking if database is empty failed')
        }
    }

    static async getKeys(pattern) {
        const keys = [];
        let cursor = '0';
        try {
            do {
                const result = await redis.scan(cursor, 'MATCH', pattern);
                cursor = result[0];
                keys.push(...result[1]);
            } while (cursor !== '0');

            return keys
        }
        catch (error) {
            throw new CustomError(500, 'redis: retrieving all users failed')
        }
    }

    static async connectDB() {
        redis = await new Redis({
            host: 'localhost',
            port: 6379,
            maxRetriesPerRequest: 3
        });
        redis.on('connect', () => {
            console.log('connected to redis')
        })

        redis.on('error', async(error) => {
            // console.log('connection to redis failed')
        })
    }
}



module.exports = RedisModel