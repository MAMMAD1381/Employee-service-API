const Redis = require('ioredis')
let redis;
const CustomError = require('../errors/CustomError');

/**
 * A class that allows direct interaction to redis
 */
class RedisModel {

    /**
     * adds a new user
     * @param {*} id 
     * @param {*} data 
     * @returns 
     */
    static async addUser(id, data) {
        await redis.select(0)
        await this.#tryCatchWrapper('hmset', 'redis: inserting new user failed', `user:${id}:${data.username}`, data)
        return data
    }

    static async updateUser(id, data) {
        await redis.select(0)
        const Key = `user:${id}:*`
        for (const [key, value] of Object.entries(data)) {
            await this.#tryCatchWrapper('hset', 'redis: updating user failed', (await redis.keys(Key))[0], key, value)
        }
        return await this.#tryCatchWrapper('hgetall', 'redis: returning updated user failed', `user:${id}`)
    }

    static async getUser(id) {
        await redis.select(0)
        const pattern = `user:${id}:*`
        const key = (await redis.keys(pattern))[0]
        if(!key) return {}
        return await this.#tryCatchWrapper('hgetall', 'redis: retrieving user failed', key)
    }

    static async getUserByUsername(username){
        await redis.select(0)
        return await this.#tryCatchWrapper('hgetall', 'redis: retrieving user failed', (await redis.keys(`user:*:${username}`))[0])
    }

    static async getUsers(parentID) {
        await redis.select(0)
        const pattern = 'user:' + parentID;
        const keys = await this.getKeys(pattern)
        const userPromises = keys.map(async (key) => await this.#tryCatchWrapper('hgetall', 'redis: retrieving all users failed', key));
        return await Promise.all(userPromises);
    }

    static async deleteUser(id) {
        await redis.select(0)
        return await this.#tryCatchWrapper('del', 'deleting user failed', `user:${id}`)
    }

    static async addParent(id, parentID) {
        await redis.select(1)
        await this.#tryCatchWrapper('set', 'redis: inserting new parentID failed', `parent:${id}`, parentID)
        return { id: parentID }
    }

    static async updateParent(id, parentID) {
        await redis.select(1)
        await this.#tryCatchWrapper('set', 'redis: updating parentID failed', `parent:${id}`, parentID)
        return { id: parentID }
    }

    static async getParent(id) {
        await redis.select(1)
        return await this.#tryCatchWrapper('get', 'redis: retrieving parentID failed', `parent:${id}`)
    }

    static async getParents() {
        await redis.select(1)
        const pattern = 'parent:*';
        const keys = await this.getKeys(pattern)
        const userPromises = keys.map(async (key) => await this.#tryCatchWrapper('get', 'redis: retrieving all users failed', key));
        const parentsValue = await Promise.all(userPromises);

        const combinedObject = keys.reduce((acc, key, index) => {
            acc[key] = parentsValue[index];
            return acc;
        }, {});
        return combinedObject
    }

    static async deleteParent(id) {
        await redis.select(1)
        return await this.#tryCatchWrapper('del', 'deleting user failed', `parent:${id}`)
    }

    static async isDatabaseEmpty(index) {
        await redis.select(index)
        return (await this.#tryCatchWrapper('dbsize', 'redis: checking if database is empty failed') === 0)
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

        redis.on('error', async (error) => {
            // console.log('connection to redis failed')
        })
    }

    static async #tryCatchWrapper(operation, message, ...params) {
        try {
            return await redis[operation](...params);
        } catch (error) {
            throw new CustomError(500, message);
        }
    }
}



module.exports = RedisModel