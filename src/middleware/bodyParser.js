const CustomError = require('../utils/CustomError')

async function bodyParser({}, req, res) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      // Accumulate the chunks of the raw request body
      body += chunk;
    });

    req.on('end', () => {
      // At this point, the entire request body has been received
      // You can process the raw body here
      // For example, if it's JSON, you can parse it:
      try {
        const parsedBody = JSON.parse(body);
        // req.body = parsedBody;
        // Resolve the Promise with the parsed body
        resolve({ body: parsedBody });
      } catch (error) {
        // Reject the Promise with an error
        throw(new CustomError('error parsing body', 500));
      }
    });

    req.on('error', (error) => {
      // Reject the Promise if there's an error during data streaming
      reject(new CustomError('error streaming request data', 500));
    });
  });
}


module.exports = bodyParser

// function a(a, b){
//   return {a,b}
// }

// console.log(a(1,2))