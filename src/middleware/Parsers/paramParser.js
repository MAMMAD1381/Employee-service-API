/**
 * a middleware that returns extracted params from request url, based on given path template
 * it will append the params to request as request.params
 * @param {String} path - example => "users/:id"
 * @returns {object} example => {id: 12345}
 * @example
 * const router = new Router(request, response)
 * router.route('users/:id').get(paramParser('users/:id'), ...controllers and middlewares)
 * // other routing codes
 */
const paramParser = (path) => async(request, response)=>{
  const placeholderPattern = /:(\w+)/g;
  const matches = []
  let match;
  let matchesName = [];
  let params = []
  while ((match = placeholderPattern.exec(path)) !== null) {
    matches.push(match[1]);
  }
  // Get positions of each match
  let paramsPos = matches.map(match => {
    const index = path.indexOf(match);
    const slashesBefore = path.slice(0, index).match(/\//g);
    const n = slashesBefore ? slashesBefore.length : 1;
    matchesName[n] = match
    return n
  });
  const extractedValues = paramsPos.map(position => {
    const parts = request.url.split('/');
    return parts[position];
  });
  paramsPos.forEach((match, index) => {
    params[matchesName[match]] = extractedValues[index]
  });
  request.params = params
  return params
}

module.exports = paramParser