/**
 * a middleware for parsing body of request
 * it will append the parsedBody to request as request.body
 * @param {Request} request 
 * @param {Response} response 
 * 
 * @example
 * const router = new Router(request, response)
 * router.route('/send').post(bodyParser, sendController)
 * // other routings
 */
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
                resolve(undefined);
            }
        });

        request.on('error', (error) => {
            reject(new CustomError('error parsing body data', 500));
        });
    });
}

module.exports = bodyParser