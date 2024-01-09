const CustomError = require("./CustomError");

function tryCatchWrapper(func, statusCode, errorMessage) {
    return async function (...args) {
        try {
            const result = await func(...args);
            return result;
        } catch (error) {
            throw new CustomError(statusCode, errorMessage)
            // console.error(`An error occurred: ${error.message}`);
        }
    };
}

module.exports = {tryCatchWrapper}