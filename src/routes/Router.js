const CustomError = require("../utils/CustomError")
const { errResponse } = require("../utils/utils")

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

  middleware(func, ...args){
    return function(...args2){
      const response = func(...args, ...args2)
      return response
    }
  }

  /**
   * set's a global path in order to execute functions for right routes, 
   * this function accepts urls with placeholders like something/:id
   * @param {String} path 
   * @returns {ThisType} this - return current object for chainablity purposes
   */
  route(path) {
    this.path = path
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

  /**
   * a method which should be called at last for execution of routes
   */
  async exec(){
    try{
      for(let method in this.handlers){
        this.#setRegex(this.handlers[method].path)
        await this.#execMethod(method, this.handlers[method].args)
      }
    }
    catch(error){
      console.log( error.message, error.stack)
      this.res.setHeader('Content-Type', 'application/json')
      if(error instanceof CustomError){
        this.res.statusCode = error.statusCode
        this.res.end(JSON.stringify({error: error.message}));
      }
      else {
        this.res.statusCode = 500
        this.res.end(JSON.stringify({error: 'server error'}));
      }
      return
    }
    await this.#end()
  }

  /**
   * executes all given functions in different routes
   * @param {String} method 
   * @param {Array} Arguments 
   */
  async #execMethod(method,Arguments){
    if (this.req.method === method && (this.path === this.req.url || this.path.test(this.req.url))) {

      this.req.params = await this.#paramParser()
      this.req.body = await this.#bodyParser()

      for (const element of Arguments) {
        await element(this.req, this.res)
      }
    }
  }

  /**
   * set's params on request if available
   */
  async #paramParser() {
    const extractedValues = this.paramsPos.map(position => {
      const parts = this.req.url.split('/');
      return parts[position];
    });
    this.paramsPos.forEach((match, index) => {
      this.params[this.matchesName[match]] = extractedValues[index]
    });
    return this.params
  }

  async #bodyParser() {
    return new Promise((resolve, reject) => {
      let body = '';
  
      this.req.on('data', (chunk) => {
        body += chunk;
      });
  
      this.req.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          resolve(parsedBody);
        } catch (error) {
          resolve({});
        }
      });
  
      this.req.on('error', (error) => {
        reject(new CustomError('error streaming request data', 500));
      });
    });
  }

  #setRegex(path) {
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

  
  /**
   * will be called internally at last, it returns error responses if error is provided
   */
  async #end() {
    if (this.res.statusMessage === undefined) {
      this.res.setHeader('Content-Type', 'application/json')
      this.res.statusCode = 400
      this.res.end(JSON.stringify({error: 'you have used bad route or http method'}));
      return
    }

  }
}

module.exports = Router