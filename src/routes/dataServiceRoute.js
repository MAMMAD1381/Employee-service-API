const { addUser, updateUser, getUser } = require('../controller/controller')
const Router = require('./Router')
const bodyParser = require('../middleware/Parsers/bodyParser')
const routingRoutes = require('../configs/routingRoutes')
const customErrorHandler = require('../errors/customErrorHandler')
const middlewares = require('../middleware/middlewares')
const schema = require('../schema/schema')
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
        .get(middlewares.parsers.param(routingRoutes.get), middlewares.validations.param(schema.param.get), getUser)

    // post
    router
        .route(routingRoutes.post)
        .post(bodyParser, middlewares.validations.body(schema.body.post), addUser)

    // put
    router
        .route(routingRoutes.put)
        .put(bodyParser, middlewares.validations.body(schema.body.put), updateUser)

    router.exec(customErrorHandler)
}

module.exports = dataService