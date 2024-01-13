const bodyParser = async (request, response) => {
    return new Promise((resolve, reject) => {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk;
        });

        request.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                request.body = parsedBody
                resolve(parsedBody);
            } catch (error) {
                resolve({});
            }
        });

        request.on('error', (error) => {
            reject(new CustomError('error parsing body data', 500));
        });
    });
}

module.exports = bodyParser