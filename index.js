const Server = require('./src/server')
const {Redis} = require('./src/model/Redis')
require('dotenv').config({path: './src/configs/config.env'})

const server = new Server(process.env.PORT)
server.listen()

Redis.connectRedis()