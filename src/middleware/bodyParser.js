const bodyParser = async (req, res) => {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                req.body = parsedBody
                resolve(parsedBody);
            } catch (error) {
                resolve({});
            }
        });

        req.on('error', (error) => {
            reject(new CustomError('error streaming request data', 500));
        });
    });
}

module.exports = bodyParser