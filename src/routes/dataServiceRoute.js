const validation = require('../middleware/validation')
const { addUser, updateUser, getUser } = require('../controller/controller')
const { reset } = require('../helper/isResponseFinished')
const { errResponse } = require('../utils/utils')
const Router = require('./Router')
const test = async (req, res) => {
    console.log('test 1')
    res.end('success')

}
const test2 = async (req, res) => {
    console.log('test 2')
    res.end('success')

}
const dataService = async (req, res) => {
    let router = new Router()
    router.routing(req, res)
    router.route('/dataService/:id').get(getUser)
    router.route('/dataService').post(addUser).put(updateUser)
    await router.exec()
}

module.exports = dataService