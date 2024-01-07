const commonResponse = (response, message, statusCode) => {
    response.setHeader('Content-Type', 'application/json')
    response.statusCode = statusCode
    response.write(JSON.stringify(message));
    response.end();
}

module.exports = commonResponse