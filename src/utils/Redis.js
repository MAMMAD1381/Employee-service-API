/**
 * Wrapper for Redis
 * @class
*/
const redis = require('redis');
let client = redis.createClient();
class Redis{
    /**
     * used for connecting to redis-server
     * use it once
     * @function
     */
    static async connectRedis(){
        client.on('connect', () => {
            console.log('Connected to Redis');
        });
    
        client.on('error', (err) => {
            console.error('Redis Error:', err);
        });
        await client.connect()
    }

    /**
     * 
     * @param {string} key - key value in redis
     * @param {string} value - value of key in redis
     */
    static async set(key, value){
        await client.set(key, value)
    }

    /**
     * 
     * @param {string} key - desired value's key
     * @returns {string} - desired value if it exists
     */
    static async get(key){
        const value = await client.get(key)
        return value
    }
}

module.exports = {Redis}