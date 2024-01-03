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

    let paramNames = ['id']
    let bodyFieldNames = []
    let routingRoute = '/dataService/:id'
    let validationMiddleware = createMiddleware(validation, paramNames, bodyFieldNames)
    let paramParserMiddleware = createMiddleware(paramParser, routingRoute)

    router.route(routingRoute).get(paramParserMiddleware, validationMiddleware, getUser)

    
    paramNames = []
    bodyFieldNames = ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education']
    routingRoute = "/dataService"
    validationMiddleware = createMiddleware(validation, paramNames, bodyFieldNames)

    router.route(routingRoute).post(bodyParser, validationMiddleware, addUser).put(bodyParser, validationMiddleware ,updateUser)

    router.exec()
}

module.exports = dataService