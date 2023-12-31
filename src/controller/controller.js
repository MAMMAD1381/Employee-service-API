const validation = require('../middleware/validation')
const { User } = require('../model/User')
const CustomError = require('../utils/CustomError')
const { getReqData } = require('../utils/utils')


const addUser = async (req, res) => {
    let data = await getReqData(req)
    if(data){
        data = JSON.parse(data)
    }
    else{
        res.error = new CustomError('nothing was provided as body', 400)
        return
    }
    req.data = data
    const validationResult = await validation(req, res, {paramsName:['id'], bodyFieldsName:['username', 'pass', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'educationResult']})
    
    if( validationResult !== null){
        res.error = validationResult
        return
    }

    const user = await User.create(data)
    if (user instanceof CustomError) {
        res.error = user
        return
    }
    res.setHeader('Content-Type', 'application/json')

    res.statusCode = 201

    res.write(JSON.stringify({
        success: true,
        user
    }));
    res.end();
}

const updateUser = async (req, res) => {
    const validationResult = await validation(req, res, {paramsName:['id'], bodyFieldsName:['username', 'pass', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'educationResult']})
    
    if( validationResult !== null){
        res.error = validationResult
        return
    }
    res.setHeader('Content-Type', 'application/json')
    const data = JSON.parse(await getReqData(req))
    const id = req.url.split("/")[2];
    let user = await User.update(id, data)
    let response
    if (user.user === null || user.error !== '') {
        res.error = new CustomError(user.error, 404)
        return
    }

    // user = User.updateUser(id, data)
    res.statusCode = 200
    response = {
        success: true,
        user: user.user

    }

    res.write(JSON.stringify(response));

    res.end();
}

const getUser = async (req, res) => {
    const validationResult = await validation(req, res, {paramsName:['id'], bodyFieldsName:['username', 'pass', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'educationResult']})
    
    if( validationResult !== null){
        res.error = validationResult
        return
    }
    res.setHeader('Content-Type', 'application/json')
    const id = req.url.split("/")[2];
    console.log(id)
    const user = await User.get(id)
    console.log(id)

    let response
    if (user.user === null || user.error !== '') {
        res.error = new CustomError(user.error, 404)
        return
    }

    res.statusCode = 200
    response = {
        success: true,
        user: user.user
    }

    res.write(JSON.stringify(response));

    res.end();
}

module.exports = { addUser, updateUser, getUser }