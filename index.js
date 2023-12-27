const http = require('http')
const dataService = require('./src/routes/dataServiceRoute')
const {Redis} = require('./src/utils/Redis')

const PORT = process.env.PORT || 5000;

const server = http.createServer(dataService);

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

Redis.connectRedis()