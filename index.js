const RedisModel = require('./src/models/RedisModel')
const Server = require('./src/server')
require('dotenv').config({ path: './.env' })

const server = new Server(process.env.PORT)
server.listen()


RedisModel.connectDB()
