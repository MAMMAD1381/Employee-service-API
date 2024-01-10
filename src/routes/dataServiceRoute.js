const { addUser, updateUser, getUser } = require('../controller/controller')
const Router = require('./Router')
const bodyParser = require('../middleware/bodyParser')
const { routingRoutes, paramParserMiddlewares, validationMiddlewares } = require('../configs/dataServiceRoute.config')
const customErrorHandler = require('../errors/customErrorHandler')

/**
 * route related to dataService
 * @param {Request} req 
 * @param {Response} res 
 */
const dataService = async (req, res) => {
    let router = new Router()

    // routings
    router.routing(req, res)

    // get
    router.route(routingRoutes.get)
        .get(paramParserMiddlewares.get, validationMiddlewares.get, getUser)

    // post
    router.route(routingRoutes.post)
        .post(bodyParser, validationMiddlewares.post, addUser)

    // put
    router.route(routingRoutes.put)
        .put(bodyParser, validationMiddlewares.put, updateUser)

    router.exec(customErrorHandler)
}

module.exports = dataService