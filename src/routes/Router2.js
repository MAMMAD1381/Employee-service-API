const { errResponse } = require("../utils/bodyParser")
const CustomError = require("../utils/CustomError")

class Router {
  /**
   * defining all global variables
   */
  constructor() {
    this.req
    this.res
    this.path
    this.paramsPos = []
    this.params = {}
    this.matchesName = {}
    this.handlers = {}
  }

  middleware(originalFunction, ...fixedArgs) {
    return async function (...args) {
      const response = await originalFunction.apply(null, fixedArgs.concat(args))
      return response;
    };
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @returns {ThisType} this - return current object for chainablity purposes
   */
  routing(req, res) {
    this.req = req
    this.res = res
    return this
  }

  /**
   * set's a global path in order to execute functions for right routes, 
   * this function accepts urls with placeholders like something/:id
   * @param {String} path 
   * @returns {ThisType} this - return current object for chainablity purposes
   */
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

  get(...args) {
    const path = this.path
    this.handlers['GET'] = { args, path, req:this.req, res:this.res}
    return this
  }

  post(...args) {
    const path = this.path
    this.handlers['POST'] = { args, path , req:this.req, res:this.res}
    return this
  }

  put(...args) {
    const path = this.path
    this.handlers['PUT'] = { args, path , req:this.req, res:this.res}
    return this
  }

  delete(...args) {
    const path = this.path
    this.handlers['DELETE'] = { args, path , req:this.req, res:this.res}
    return this
  }

  update(...args) {
    const path = this.path
    this.handlers['UPDATE'] = { args, path , req:this.req, res:this.res}
    return this
  }

  /**
   * a method which should be called at last for execution of routes
   */
  async exec() {
    for (let method in this.handlers) {
      console.log(this.params)
      // this.path = this.handlers[method].path
      // this.req = this.handlers[method].req
      // this.res = this.handlers[method].res
      // this.#setParams()
      console.log(this.path, this.params, this.req.url)
      await this.#execMethod(method, this.handlers[method].args)
    }
    await this.#end()
  }

  /**
   * executes all given functions in different routes
   * @param {String} method 
   * @param {Array} Arguments 
   */
  async #execMethod(method, Arguments) {
    // this.req.params = params
    if (this.req.method === method && (this.path === this.req.url || this.path.test(this.req.url))) {
      this.#setParams()
      const promises = [];
      for (const element of Arguments) {
        // console.log(element)
        const response = await element(this.req, this.res)
        if(response instanceof Error){
          this.res.error = response
          return
        }
        promises.push(element(this.req, this.res));
      }
      // await Promise.all(promises);

    }
  }

  /**
   * set's params on request if available
   */
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

  /**
   * will be called internally at last, it returns error responses if error is provided
   */
  async #end() {
    if (this.res.error !== undefined) {
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