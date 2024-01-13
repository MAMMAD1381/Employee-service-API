const { addUser, updateUser, getUser } = require('../controller/controller')
const Router = require('./Router')
const bodyParser = require('../middleware/Parsers/bodyParser')
const { routingRoutes, paramParserMiddlewares, paramValidationMiddlewares, bodyValidationMiddlewares } = require('../configs/dataServiceRoute.config')
const customErrorHandler = require('../errors/customErrorHandler')

/**
 * route related to dataService
 * @param {Request} req 
 * @param {Response} res 
 */
const dataService = async (req, res) => {
    let router = new Router(req, res)

    // get
    router
        .route(routingRoutes.get)
        .get(paramParserMiddlewares.get, paramValidationMiddlewares.get, getUser)

    // post
    router
        .route(routingRoutes.post)
        .post(bodyParser, bodyValidationMiddlewares.post, addUser)

    // put
    router
        .route(routingRoutes.put)
        .put(bodyParser, bodyValidationMiddlewares.put, updateUser)

    router.exec(customErrorHandler)
}

module.exports = dataService