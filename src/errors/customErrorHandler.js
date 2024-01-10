const CustomError = require("./CustomError")


const customErrorHandler = async(error, response)=>{
    console.log(error.stack)
    response.setHeader('Content-Type', 'application/json')
    if(error instanceof CustomError){
      response.statusCode = error.statusCode
      response.end(JSON.stringify({error: error.message}));
    }
    else if(error.message === 'Reached the max retries per request limit (which is 3). Refer to "maxRetriesPerRequest" option for details.'){
      response.statusCode = 500
      response.end(JSON.stringify({error: 'database connection error'}));
    }
    else {
      response.statusCode = 500
      response.end(JSON.stringify({error: 'server error'}));
    }
}

module.exports = customErrorHandler