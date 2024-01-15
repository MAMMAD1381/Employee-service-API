
/**
 * a class that can create Custom Errors with desired statusCode and message
 * @param {Number} statusCode status code for desired error
 * @param {String} userMessage an optional message, if not provided will be replaced by a predefined message
 */
class CustomError extends Error {
    constructor(statusCode, userMessage) {
        let message
        if (statusCode === 200)
            message = 'successful request'
        else if (statusCode === 201)
            message = 'successful creation of resource'
        else if (statusCode === 400)
            message = 'bad request'
        else if (statusCode === 403)
            message = 'not authorized'
        else if (statusCode === 404)
            message = 'resource not found'
        else if (statusCode === 500)
            message = 'server error'
        else {
            statusCode = 500
            message = 'server error'
        }
        
        if (userMessage)
            super(userMessage)
        else
            super(message)
        this.statusCode = statusCode
    }
}

module.exports = CustomError