const { isResEnded, reset } = require("../helper/isResponseFinished")
const { errResponse } = require("../utils/utils")

class Router{
    constructor(){
        this.req
        this.res
        this.path
    }

    routing(req, res){
        this.req = req
        this.res = res
        return this
    }

    route(path){
        this.path = new RegExp(path)
        return this
    }

    async get(){
        if(this.req.method === 'GET' && this.path.test(this.req.url))
            for (const element of arguments) 
                await element(this.req, this.res)
            
        return this
    }

    async post(){
        if(this.req.method === 'POST' && this.path.test(this.req.url))
            for (const element of arguments) 
                await element(this.req, this.res)            
        return this
    }

    async put(){
        if(this.req.method === 'PUT' && this.path.test(this.req.url))
            for (const element of arguments) 
                await element(this.req, this.res)     
        return this
    }

    async delete(){
        if(this.req.method === 'DELETE' && this.path.test(this.req.url))
            for (const element of arguments) 
                await element(this.req, this.res)     
        return this
    }

    async update(){
        if(this.req.method === 'UPDATE' && this.path.test(this.req.url))
            for (const element of arguments) 
                await element(this.req, this.res)     
        return this
    }

    async next(){
        if(this.res.statusMessage===undefined){
            console.log('not here')
            await errResponse(this.req, this.res, 'route not found', 400)
        }
        
    }
}

module.exports = Router