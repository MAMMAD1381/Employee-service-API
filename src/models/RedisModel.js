const Redis = require('ioredis')
const redis = new Redis()
const getKeys = require('../helper/searchDB');
const CustomError = require('../utils/CustomError');

class RedisModel {

    static async #changeDBindex(index) {
        if (index < 16 && index >= 0) {
            await redis.select(index)
        }
    }


    static async addUser(id, data) {
        await this.#changeDBindex(0)
        try {
            redis.hmset(id, data)
            return data
        }
        catch (error) {
            console.log(error.stack)
            throw new CustomError(500, 'redis: inserting new user failed')
        }

    }

    static async updateUser(id, data) {
        await this.#changeDBindex(0)
        try {
            for (const [key, value] of Object.entries(data)) {
                redis.hset(id, key, value)
            }
            let updatedUser = redis.hgetall(id)
            return updatedUser
        }
        catch (error) {
            console.log(error.stack)
            throw new CustomError(500, 'redis: updating user failed')
        }
    }

    static async getUser(id) {
        await this.#changeDBindex(0)
        try {
            let user = await redis.hgetall(id)
            return user
        }
        catch (error) {
            throw new CustomError(500, 'redis: retrieving user failed')
        }
    }

    static async getUsers() {
        await this.#changeDBindex(0)
        const pattern = '*';
        try {
            const keys = await getKeys(pattern, redis)
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
            await redis.set(id, parentID)
            return { id: parentID }
        }
        catch (error) {
            console.log(error.stack)
            throw new CustomError(500, 'redis: inserting new parentID failed')
        }
    }

    static async updateParent(id, parentID) {
        await this.#changeDBindex(1)
        try {
            await redis.set(id, parentID)
            return { id: parentID }
        }
        catch (error) {
            console.log(error.stack)
            throw new CustomError(500, 'redis: updating parentID failed')
        }
    }

    static async getParent(id) {
        await this.#changeDBindex(1)
        try {
            let parent = await redis.get(id)
            console.log(parent)
            return parent
        }

        catch (error) {
            throw new CustomError(500, 'redis: retrieving parentID failed')
        }
    }

    static async getParents() {
        await this.#changeDBindex(1)
        const pattern = '*';
        try {
            const keys = await getKeys(pattern, redis)
            const userPromises = keys.map(key => redis.get(key));
            const parents = await Promise.all(userPromises);
            return parents
        }
        catch (error) {
            console.log(error.stack)
            throw new CustomError(500, 'redis: retrieving all users failed')
        }
    }

    static async isDatabaseEmpty(index) {
        try {
            this.#changeDBindex(index)
            const dbSize = await redis.dbsize()
            return dbSize
        } catch (error) {
            throw new CustomError(500, 'redis: checking if database is empty failed')
        }
    }
}

module.exports = RedisModel