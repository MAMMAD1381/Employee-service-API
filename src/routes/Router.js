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
    this.lastResult = {}
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
    // const placeholderPattern = /:(\w+)/g;
    // // Find all matches in the URL pattern
    // const matches = []
    // let match;
    // while ((match = placeholderPattern.exec(path)) !== null) {
    //   matches.push(match[1]);
    // }
    // // Get positions of each match
    // this.paramsPos = matches.map(match => {
    //   const index = path.indexOf(match);
    //   const slashesBefore = path.slice(0, index).match(/\//g);
    //   const n = slashesBefore ? slashesBefore.length : 1;
    //   this.matchesName[n] = match
    //   return n
    // });
    // //setting a regex based on given path
    // const regexPattern = path.replace(/:\w+/g, '\\w+');
    // const regex = new RegExp(`^${regexPattern}$`);

    this.path = path
    return this
  }

  reg(path) {
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

  /**
   * a method which should be called at last for execution of routes
   */
  async exec(){
    // await this.#paramParser()
    // console.log(this.req.params, this.params, this.req.url)

    try{
      for(let method in this.handlers){
        this.reg(this.handlers[method].path)
        await this.#execMethod(method, this.handlers[method].args)
      }
    }
    catch(error){
      console.log(error.message, error.stack)
      this.res.setHeader('Content-Type', 'application/json')
      this.res.statusCode = error.statusCode
      // this.res.write('sada')
      this.res.end(JSON.stringify({error: error.message}));
      return
      // await this.#end()

    }


  }

  /**
   * executes all given functions in different routes
   * @param {String} method 
   * @param {Array} Arguments 
   */
  async #execMethod(method,Arguments){
    if (this.req.method === method && (this.path === this.req.url || this.path.test(this.req.url))) {
      console.log(this.path)

      await this.#paramParser()
      const promises = [];
      for (const element of Arguments) {
        console.log(element, this.req.params, this.params)
        // if(this.lastResult === undefined) lastResult = {}
        // console.log(this.lastResult)
        this.lastResult = await element(this.lastResult, this.req, this.res)
        // promises.push(element(this.req, this.res));
      }
      // await Promise.all(promises);

    }
  }

  /**
   * set's params on request if available
   */
  async #paramParser() {
    const extractedValues = this.paramsPos.map(position => {
      const parts = this.req.url.split('/');
      console.log(parts)
      return parts[position];
    });
    this.paramsPos.forEach((match, index) => {
      this.params[this.matchesName[match]] = extractedValues[index]
    });
    this.req.params = this.params
  }

  async #bodyParser({}, req, res) {
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

  /**
   * will be called internally at last, it returns error responses if error is provided
   */
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