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
    router.routing(req, res)
    router.route('/dataService/:id').get(getUser)
    router.route('/dataService').post(addUser).put(updateUser)
    router.exec()
}

module.exports = dataService