const validation = require('../middleware/validation')
const { addUser, updateUser, getUser } = require('../controller/controller')
const Router = require('./Router')
const paramParser = require('../middleware/paramParser')
const bodyParser = require('../middleware/bodyParser')

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
    let validationMiddleware = router.middleware(validation, paramNames, bodyFieldNames)
    let paramParserMiddleware = router.middleware(paramParser, routingRoute)
    router.route(routingRoute).get(paramParserMiddleware, validationMiddleware, getUser)

    paramNames = []
    bodyFieldNames = ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education']
    routingRoute = "/dataService"
    // let bodyParserMiddleware = router.middleware(bodyParser)
    validationMiddleware = router.middleware(validation, paramNames, bodyFieldNames)
    router.route(routingRoute).post(bodyParser, validationMiddleware, addUser).put(bodyParser, validationMiddleware ,updateUser)

    router.exec()
}

module.exports = dataService