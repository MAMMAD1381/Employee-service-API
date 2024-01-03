const http = require('http')
const dataService = require('./src/routes/dataServiceRoute')
const Server = require('./src/server')
const {Redis} = require('./src/utils/Redis')
require('dotenv').config({path: './src/configs/config.env'})

const server = new Server(process.env.PORT)
server.listen()

Redis.connectRedis()