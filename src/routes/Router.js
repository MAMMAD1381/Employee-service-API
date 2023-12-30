const { isResEnded, reset } = require("../helper/isResponseFinished")
const { errResponse } = require("../utils/utils")

class Router {
  constructor() {
    this.req
    this.res
    this.path
    this.paramsPos = []
    this.params = {}
    this.isSimple
  }

  routing(req, res) {
    this.req = req
    this.res = res
    return this
  }

  route(path) {

    const placeholderPattern = /:(\w+)/g;
    // Find all matches in the URL pattern
    const matches = [];
    let match;
    while ((match = placeholderPattern.exec(path)) !== null) {
      matches.push(match[1]);
    }

    // Get positions of each match
    this.paramsPos = matches.map(match => {
      const index = path.indexOf(match);
      const slashesBefore = path.slice(0, index).match(/\//g);
      return slashesBefore ? slashesBefore.length : 1;
    });

    //setting a regex based on given path
    const regexPattern = path.replace(/:\w+/g, '\\w+');
    const regex = new RegExp(`^${regexPattern}$`);

    this.path = regex
    return this
  }

  async get() {
    await this.#execMethod('GET', arguments)
    return this
  }

  async post() {
    await this.#execMethod('POST', arguments)
    return this
  }

  async put() {
    await this.#execMethod('PUT', arguments)
    return this
  }

  async delete() {
    await this.#execMethod('DELETE', arguments)
    return this
  }

  async update() {
    await this.#execMethod('UPDATE', arguments)
    return this
  }

  async #execMethod(method,Arguments){
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
      this.params[match] = extractedValues[index]
    });
    this.req.params = this.params
  }

  async end() {
    

    if(this.res.error !== undefined){
      const error = this.res.error
      this.res.setHeader('Content-Type', 'application/json')
      console.log(error)

      this.res.statusCode = error.statusCode
      this.res.end(JSON.stringify({ error: error.message, statusCode: error.statusCode }));
    }
    else if (this.res.statusMessage === undefined) {
      console.log(this.res.errors)
      console.log('not here')
      await errResponse(this.req, this.res, 'route not found', 400)
      return
    }

  }
}

module.exports = Router