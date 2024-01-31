const { addUser, updateUser, getUser, deleteUser, getUsers } = require('../controller/controller')
const Router = require('./Router')
const customErrorHandler = require('../errors/customErrorHandler')
const schema = require('../schema/schema')

// middlewares
const paramParser = require('../middleware/Parsers/paramParser')
const paramValidation = require('../middleware/Validations/paramValidation')
const bodyValidation = require('../middleware/Validations/bodyValidation')
const bodyParser = require('../middleware/Parsers/bodyParser')

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
        .get(paramParser(routingRoutes.get), paramValidation(schema.param.get), getUser)

    // post
    router
        .route(routingRoutes.post)
        .post(bodyParser, bodyValidation(schema.body.post), addUser)

    // put
    router
        .route(routingRoutes.put)
        .put(bodyParser, bodyValidation(schema.body.put), updateUser)

    router
        .route(routingRoutes.delete)
        .delete(paramParser(routingRoutes.delete), paramValidation(schema.param.delete), deleteUser)

    router
        .route(routingRoutes.getUsers)
        .get(paramParser(routingRoutes.getUsers), paramValidation(schema.param.getUsers), getUsers)
    router.exec(customErrorHandler)
}

const routingRoutes = {
    get: '/dataService/:id',
    post: '/dataService',
    put: '/dataService',
    delete: '/dataService/:id',
    getUsers: '/dataService/users/:parentID'
}


module.exports = dataService