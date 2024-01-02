async function bodyParser(req, res) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on("data", (chunk) => {
                // append the string version to the body
                body += chunk.toString();
            });
            req.on("end", () => {
                if (body) {
                    req.data = JSON.parse(body)
                }
                else {
                    res.error = new CustomError('nothing was provided as body', 400)
                    return
                }
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {bodyParser};

