const createMiddleware = require('../helper/createMiddleware')
const bodyValidation = require('../middleware/Validations/bodyValidation')
const paramParser = require('../middleware/Parsers/paramParser')
const paramValidation = require('../middleware/Validations/paramValidation')
const bodySchema = require('../schema/BodySchema')
const paramSchema = require('../schema/paramSchema')


const routingRoutes = {
    get: '/dataService/:id',
    post: '/dataService',
    put: '/dataService'
}

const paramValidationMiddlewares = {
    get: createMiddleware(paramValidation, paramSchema.get),
    post: createMiddleware(paramValidation, paramSchema.post),
    put: createMiddleware(paramValidation, paramSchema.put)
}

const bodyValidationMiddlewares = {
    get: createMiddleware(bodyValidation, bodySchema.get),
    post: createMiddleware(bodyValidation, bodySchema.post),
    put: createMiddleware(bodyValidation, bodySchema.put)
}

const paramParserMiddlewares = {
    get: createMiddleware(paramParser, routingRoutes.get),
    post: createMiddleware(paramParser, routingRoutes.post),
    put: createMiddleware(paramParser, routingRoutes.put)
}

module.exports = {
    routingRoutes,
    paramParserMiddlewares,
    bodyValidationMiddlewares,
    paramValidationMiddlewares
}