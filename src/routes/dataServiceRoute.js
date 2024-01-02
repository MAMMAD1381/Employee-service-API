const validation = require('../middleware/validation')
const { addUser, updateUser, getUser } = require('../controller/controller')
const Router = require('./Router')
const bodyParser = require('../middleware/bodyParser')

/**
 * route related to dataService
 * @param {Request} req 
 * @param {Response} res 
 */
const dataService = async (req, res) => {
    let router = new Router()

    const bodyParserMiddleware = router.middleware(bodyParser)
    const validationMiddleware = router.middleware(validation, ['id'], ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education'])


    router.routing(req, res)
    router.route('/dataService/:id').get(validationMiddleware, getUser)
    router.route('/dataService').post(bodyParserMiddleware, validationMiddleware, addUser).put(bodyParserMiddleware, validationMiddleware ,updateUser)
    router.exec()
}

module.exports = dataService