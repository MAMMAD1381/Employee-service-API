const { isResEnded, reset } = require("../helper/isResponseFinished")
const { errResponse } = require("../utils/utils")

class Router {
  constructor() {
    this.req
    this.res
    this.path
    this.paramsPos = []
    this.params = {}
    this.matchesName = {}
    this.handlers = {}
  }

  routing(req, res) {
    this.req = req
    this.res = res
    return this
  }

  route(path) {

    const placeholderPattern = /:(\w+)/g;
    // Find all matches in the URL pattern
    const matches = []
    let match;
    while ((match = placeholderPattern.exec(path)) !== null) {
      matches.push(match[1]);
    }
    // Get positions of each match
    this.paramsPos = matches.map(match => {
      const index = path.indexOf(match);
      const slashesBefore = path.slice(0, index).match(/\//g);
      const n = slashesBefore ? slashesBefore.length : 1;
      this.matchesName[n] = match
      return n
    });
    //setting a regex based on given path
    const regexPattern = path.replace(/:\w+/g, '\\w+');
    const regex = new RegExp(`^${regexPattern}$`);

    this.path = regex
    return this
  }

  get() {
    const currentPath = this.path
    this.handlers['GET'] = {args: arguments, path: currentPath}
    return this
  }

  post() {
    const currentPath = this.path
    this.handlers['POST'] = {args: arguments, path: currentPath}
    return this
  }

  put() {
    const currentPath = this.path
    this.handlers['PUT'] = {args: arguments, path: currentPath}
    return this
  }

  delete() {
    const currentPath = this.path
    this.handlers['DELETE'] = {args: arguments, path: currentPath}
    return this
  }

  update() {
    const currentPath = this.path
    this.handlers['UPDATE'] = {args: arguments, path: currentPath}
    return this
  }

  async exec(){
    for(let method in this.handlers){
      this.path = this.handlers[method].path
      await this.#execMethod(method, this.handlers[method].args)
    }
    await this.#end()
  }

  async #execMethod(method,Arguments){
    console.log(method)
    if (this.req.method === method && (this.path === this.req.url || this.path.test(this.req.url))) {
      this.#setParams()
      const promises = [];
      for (const element of Arguments) {
        promises.push(element(this.req, this.res));
      }
      await Promise.all(promises);

    }
  }

  #setParams() {
    const extractedValues = this.paramsPos.map(position => {
      const parts = this.req.url.split('/');
      return parts[position];
    });
    this.paramsPos.forEach((match, index) => {
      this.params[this.matchesName[match]] = extractedValues[index]
    });
    this.req.params = this.params
  }

  async #end() {
    if(this.res.error !== undefined){
      const error = this.res.error
      this.res.setHeader('Content-Type', 'application/json')

      this.res.statusCode = error.statusCode
      this.res.end(JSON.stringify({ error: error.message, statusCode: error.statusCode }));
    }
    else if (this.res.statusMessage === undefined) {
      await errResponse(this.req, this.res, 'route not found', 400)
      return
    }

  }
}

module.exports = Router