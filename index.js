const Server = require('./src/server')
require('dotenv').config({ path: './.env' })

const server = new Server(process.env.PORT)
server.listen()