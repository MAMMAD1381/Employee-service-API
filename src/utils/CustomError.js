class CustomError extends Error{
    constructor(statusCode, additionalMessage=''){
        let message
        if(statusCode === 200)
            message = 'successful request'
        else if(statusCode === 201)
            message = 'successful creation of resource'
        else if(statusCode === 400)
            message = 'bad request'
        else if(statusCode === 403)
            message = 'not authorized'
        else if(statusCode === 404)
            message = 'resource not found'
        else if(statusCode === 500)
            message = 'server error'
        else{
            statusCode = 500
            message = 'server error'
        }
        super(`${message}: ${additionalMessage}`)
        this.statusCode = statusCode
    }

}

module.exports = CustomError