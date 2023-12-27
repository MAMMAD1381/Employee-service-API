const {addUser, updateUser, getUser} = require('../controller/controller')
const { reset } = require('../helper/isResponseFinished')
const { errResponse } = require('../utils/utils')
const Router = require('./Router')
const test = async (req, res)=>{
    console.log('test 1')
    res.end('success')
    reset()
}
const test2 = async (req, res) => {
    res.end('test 2')
    reset()
}
const dataService = async (req, res) => {
    let router = new Router()
    router.routing(req, res)
    // ;(await router.route(/\/dataService\/([0-9]+)/).get(getUser)).put(updateUser)
    // await router.route('/dataService').post(addUser)
    // ;(await router.route('/space').get(test2))
    console.log(router.route('/something/:id/something/:ee'))
    // if(req.url.match(/\/dataService\/([0-9]+)/)){

    //     if(req.method === 'GET'){
    //         await getUser(req, res)
    //     }
    //     else if(req.method === 'PUT'){
    //         await updateUser(req, res)
    //     }
    //     else{
    //         errResponse(req, res, 'Route not found', 400)
    //     }
    // }
    // else if(req.url === '/dataService'){
    //     if(req.method === 'POST'){
    //        await addUser(req, res)
    //     }
    //     else{
    //         errResponse(req, res, 'Route not found', 400)
    //     }
    // }
    // // If no route present
    // else {
    //     errResponse(req, res, 'Route not found', 400)
    // }
}

module.exports = dataService