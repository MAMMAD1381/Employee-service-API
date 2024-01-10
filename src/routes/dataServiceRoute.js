const validation = require('../middleware/validation')
const { addUser, updateUser, getUser } = require('../controller/controller')
const Router = require('./Router')
const paramParser = require('../middleware/paramParser')
const bodyParser = require('../middleware/bodyParser')
const createMiddleware = require('../helper/createMiddleware')
const { routingRoutes, paramParserMiddlewares, validationMiddlewares } = require('../configs/dataServiceRoute.config')

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

    router.exec()
}

module.exports = dataService