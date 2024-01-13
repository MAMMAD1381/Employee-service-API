const CustomError = require("../errors/CustomError");


async function tryCatchWrapper(operation, errorObject, ...params) {
    try {
        return await operation(...params);
    } catch (error) {
        console.log(error.stack)
        if (errorObject instanceof Error) {
            throw errorObject;
        } else {
            throw new CustomError(500, `redis: ${errorObject}`);
        }
    }
}

module.exports = tryCatchWrapper;