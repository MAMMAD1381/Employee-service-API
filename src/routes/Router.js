const CustomError = require("../utils/CustomError")

class Router {
  /**
   * defining all global variables
   */
  constructor() {
    this.request
    this.response
    this.path
    this.handlers = {}
  }

  /**
   * 
   * @param {Request} request 
   * @param {Response} response 
   * @returns {ThisType} this - return current object for chainablity purposes
   */
  routing(request, response) {
    this.request = request
    this.response = response
    return this
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
      const executionBuffer = []
      for(let method in this.handlers){
        this.#setRegex(this.handlers[method].path)
        // await this.#execMethod(method, this.handlers[method].args)
        executionBuffer.push(this.#execMethod(method, this.handlers[method].args))
      }
      await Promise.all(executionBuffer)
    }
    catch(error){
      console.log(error.stack)
      this.response.setHeader('Content-Type', 'application/json')
      if(error instanceof CustomError){
        this.response.statusCode = error.statusCode
        this.response.end(JSON.stringify({error: error.message}));
      }
      else {
        this.response.statusCode = 500
        this.response.end(JSON.stringify({error: 'server error'}));
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
    if (this.request.method === method && (this.path === this.request.url || this.path.test(this.request.url))) {
      for (const element of Arguments) {
        await element(this.request, this.response)
      }
    }
  }

  #setRegex(path) {
    const regexPattern = path.replace(/:\w+/g, '\\w+');
    const regex = new RegExp(`^${regexPattern}$`);

    this.path = regex
    return this
  }

  
  /**
   * will be called internally at last, it returns error responses if error is provided
   */
  async #end() {
    if (this.response.statusMessage === undefined) {
      this.response.setHeader('Content-Type', 'application/json')
      this.response.statusCode = 400
      this.response.end(JSON.stringify({error: 'you have used bad route or http method'}));
      return
    }

  }
}

module.exports = Router