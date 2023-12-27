const {User} = require('../model/User')
const {getReqData} = require('../utils/utils')


const addUser = async (req, res)=>{
    res.setHeader('Content-Type', 'application/json')
    const data = JSON.parse(await getReqData(req))
    const user = await User.create(data)
    let response
    console.log(user)
    if(user.user === null || user.error !== ''){
        res.statusCode = 403
        response = {
            success: false,
            message: user.error
        }
    }
    else{
        res.statusCode = 201
        response = {
            success: true,
            user: user.user
        }
    }

    res.write(JSON.stringify(response));
    res.end();
}

const updateUser = async (req, res)=>{
    res.setHeader('Content-Type', 'application/json')
    const data = JSON.parse(await getReqData(req))
    const id = req.url.split("/")[2];
    let user = await User.update(id, data)
    let response
    if(user.user === null || user.error !== ''){
        res.statusCode = 404
        response = {
            success: false,
            message: user.error
        }
    }
    else{
        // user = User.updateUser(id, data)
        res.statusCode = 200
        response = {
            success: true,
            user: user.user
        }
    }

    res.write(JSON.stringify(response));
    
    res.end();
}

const getUser = async (req, res)=>{
    res.setHeader('Content-Type', 'application/json')
    const id = req.url.split("/")[2];
    console.log(id)                  
    const user = await User.get(id)
    console.log(id)                  

    let response
    if(user.user === null || user.error !== ''){
        res.statusCode = 404
        response = {
            success: false,
            message: user.error
        }
    }
    else{
        res.statusCode = 200
        response = {
            success: true,
            user: user.user
        }
    }
    res.write(JSON.stringify(response));
    
    res.end();
}

module.exports = {addUser, updateUser, getUser}