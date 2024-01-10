const createMiddleware = require('../helper/createMiddleware')
const paramParser = require('../middleware/paramParser')
const validation = require('../middleware/validation')
const bodySchema = require('../schema/BodySchema')


const routingRoutes = {
    get: '/dataService/:id',
    post: '/dataService',
    put: '/dataService'
}

const paramParserMiddlewares = {
    get: createMiddleware(paramParser, routingRoutes.get),
    post: createMiddleware(paramParser, routingRoutes.post),
    put: createMiddleware(paramParser, routingRoutes.put)
}

const validationMiddlewares = {
    get: createMiddleware(validation, ['id'], bodySchema.get),
    post: createMiddleware(validation, [], bodySchema.post),
    put: createMiddleware(validation, [], bodySchema.put)
}

module.exports = {
    routingRoutes,
    paramParserMiddlewares,
    validationMiddlewares
}