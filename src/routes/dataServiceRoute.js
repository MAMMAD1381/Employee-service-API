const validation = require('../middleware/validation')
const { addUser, updateUser, getUser } = require('../controller/controller')
const Router = require('./Router')
const paramParser = require('../middleware/paramParser')
const bodyParser = require('../middleware/bodyParser')
const createMiddleware = require('../helper/createMiddleware')

/**
 * route related to dataService
 * @param {Request} req 
 * @param {Response} res 
 */
const dataService = async (req, res) => {
    let router = new Router()
    router.routing(req, res)

    // routes
    let routingRoute1 = '/dataService/:id'
    let routingRoute2 = "/dataService"

    // middleWares
    let validationMiddleware1 = createMiddleware(validation, ['id'], [])
    let validationMiddleware2 = createMiddleware(validation, ['id'], ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education'])
    let validationMiddleware3 = createMiddleware(validation, [], ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education'])
    let paramParserMiddleware = createMiddleware(paramParser, routingRoute1)

    // routings
    router.route(routingRoute1).get(paramParserMiddleware, validationMiddleware1, getUser).put(paramParserMiddleware, bodyParser, validationMiddleware2 ,updateUser)
    router.route(routingRoute2).post(bodyParser, validationMiddleware3, addUser)
    // router.route(routingRoute1).get(paramParserMiddleware, validationMiddleware1, getUser)
    // router.route(routingRoute2).post(bodyParser, validationMiddleware3, addUser).put(bodyParser, validationMiddleware3 ,updateUser)
    router.exec()
}

module.exports = dataService