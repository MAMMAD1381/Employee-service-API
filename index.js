const Server = require('./src/server')
const RedisRepository = require('./src/repositories/RedisRepository')
require('dotenv').config({path: './.env'})
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
  
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    const server = new Server(process.env.PORT)
    server.listen()
    
    RedisRepository.connectRedis()
  }