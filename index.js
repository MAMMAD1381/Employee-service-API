const Server = require('./src/server')
const RedisRepository = require('./src/repositories/RedisRepository')
require('dotenv').config({path: './.env'})

const server = new Server(process.env.PORT)
server.listen()

RedisRepository.connectRedis()