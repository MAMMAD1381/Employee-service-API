const validation = require('../middleware/validation')
const { addUser, updateUser, getUser } = require('../controller/controller')
const Router = require('./Router')

/**
 * route related to dataService
 * @param {Request} req 
 * @param {Response} res 
 */
const dataService = async (req, res) => {
    let router = new Router()

    const validationMiddleware = router.middleware(validation, [], ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education'])
    const getRouteValidationMiddleware = router.middleware(validation, ['id'], [])

    router.routing(req, res)
    router.route('/dataService/:id').get(getRouteValidationMiddleware, getUser)
    router.route('/dataService').post(validationMiddleware, addUser).put(validationMiddleware ,updateUser)
    router.exec()
}

module.exports = dataService