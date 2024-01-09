const CustomError = require("../utils/CustomError");

const getKeys = async (pattern, redis)=>{
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
        console.log(error.stack)
        throw new CustomError(500, 'redis: retrieving all users failed')
    }


}

module.exports = getKeys