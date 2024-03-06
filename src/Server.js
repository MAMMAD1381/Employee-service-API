const http = require('http')
const dataService = require('./routes/dataServiceRoute')


class Server{
    constructor(port){
        this.port = port || 5000
        this.server = http.createServer(dataService)
    }
    listen(){
        this.server.listen(this.port, () => {
            console.log(`server started on port: ${this.port}`);
        })
    }
}


module.exports = Server