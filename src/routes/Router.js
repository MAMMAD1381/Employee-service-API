const { isResEnded, reset } = require("../helper/isResponseFinished")
const { errResponse } = require("../utils/utils")

class Router{
    constructor(){
        this.req
        this.res
        this.path
        this.params
    }

    routing(req, res){
        this.req = req
        this.res = res
        return this
    }

    route(path){
        // something/:id/something\
        const paramPattern = /\/:([^/]+)/g;

        if (paramPattern.test(path)) {
          // The path contains parameters
          const pathSegments = path.split('/');
          const reqSegments = this.req.url.split('/');
      
          // Ensure the number of segments match
          if (pathSegments.length === reqSegments.length) {
            const params = {};
            let paramPosition = 0;
      
            for (let i = 0; i < pathSegments.length; i++) {
              const pathSegment = pathSegments[i];
              const reqSegment = reqSegments[i];
      
              if (pathSegment.startsWith(':')) {
                // If the path segment is a parameter, extract its value
                const paramName = pathSegment.slice(1);
                const paramValue = reqSegment;
      
                if (!paramValue) {
                  // If the parameter is empty, return null
                  params[paramName] = null;
                } else {
                  // Otherwise, store the parameter value
                  params[paramName] = paramValue;
                }
      
                // Check if this is the position of :id
                if (paramPosition === 1 && !paramValue) {
                  // :id is empty, return null
                  this.params =null
                }
      
                paramPosition++;
              } else if (pathSegment !== reqSegment) {
                // If non-parameter segments don't match, return null
                return { type: 'invalid', params: null };
              }
            }
             this.params = params
            else {
                this.path = path
            }
          }
        }
        this.path = new RegExp(path)
        return this
    }

    async get(){
        if(this.req.method === 'GET' && this.path.test(this.req.url)){
            const promises = [];
            for (const element of arguments) {
              promises.push(element(this.req, this.res));
            }
            await Promise.all(promises);
        }
        await this.next();

        return this
    }

    async post(){
        console.log(this.path)
        if(this.req.method === 'POST' && this.path.test(this.req.url)){
            const promises = [];
            for (const element of arguments) {
              promises.push(element(this.req, this.res));
            }
            await Promise.all(promises);
        }      
        await this.next();

        return this
    }

    async put(){
        if(this.req.method === 'PUT' && this.path.test(this.req.url)){
            const promises = [];
            for (const element of arguments) {
              promises.push(element(this.req, this.res));
            }
            await Promise.all(promises);
        }
        await this.next();

        return this
    }

    async delete(){
        if(this.req.method === 'DELETE' && this.path.test(this.req.url)){
            const promises = [];
            for (const element of arguments) {
              promises.push(element(this.req, this.res));
            }
            await Promise.all(promises);
        }
        await this.next();

        return this
    }

    async update(){
        if(this.req.method === 'UPDATE' && this.path.test(this.req.url)){
            const promises = [];
            for (const element of arguments) {
              promises.push(element(this.req, this.res));
            }
            await Promise.all(promises);
            
        }
        await this.next();
        return this
    }

    async next(){
        console.log('here')
        if(this.res.statusMessage===undefined){
            console.log('not here')
            await errResponse(this.req, this.res, 'route not found', 400)
        }
        
    }
}

module.exports = Router