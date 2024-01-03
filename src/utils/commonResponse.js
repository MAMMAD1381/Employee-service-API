const commonResponse = (res, message, statusCode) => {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = statusCode
    res.write(JSON.stringify(message));
    res.end();
}

module.exports = commonResponse