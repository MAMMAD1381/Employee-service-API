const validation = require('../middleware/validation')
const { User } = require('../model/User')
const CustomError = require('../utils/CustomError')
const { getReqData } = require('../utils/utils')

/**
 * adds user using User model
 * @param {Request} req 
 * @param {Response} res 
 */
const addUser = async (req, res) => {
    let data = await getReqData(req)
    if (data) {
        data = JSON.parse(data)
    }
    else {
        res.error = new CustomError('nothing was provided as body', 400)
        return
    }
    req.data = data

    const validationResult = await validation(req, res, { paramsName: ['id'], bodyFieldsName: ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education'] })
    if (validationResult !== null) {
        res.error = validationResult
        return
    }

    // add user using User model
    const user = await User.create(data)
    if (user instanceof CustomError) {
        res.error = user
        return
    }

    // send data
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 201
    res.write(JSON.stringify({
        success: true,
        user
    }));
    res.end();
}

/**
 * updates a user with give id using User model
 * @param {Request} req 
 * @param {Response} res 
 */
const updateUser = async (req, res) => {
    let data = await getReqData(req)
    if (data) {
        data = JSON.parse(data)
    }
    else {
        res.error = new CustomError('nothing was provided as body', 400)
        return
    }
    req.data = data

    const validationResult = await validation(req, res, { paramsName: ['id'], bodyFieldsName: ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education'] })
    if (validationResult !== null) {
        res.error = validationResult
        return
    }

    // update user
    let user = await User.update(data)
    if (user instanceof CustomError) {
        res.error = user
        return
    }

    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.write(JSON.stringify({
        success: true,
        user
    }));
    res.end();
}

/**
 * returns the user associated to given id
 * @param {Request} req 
 * @param {Request} res 
 * @returns 
 */
const getUser = async (req, res) => {
    const validationResult = await validation(req, res, { paramsName: ['id'] })
    if (validationResult !== null) {
        res.error = validationResult
        return
    }

    const id = req.url.split("/")[2];
    let user = await User.get(id)
    if (user instanceof CustomError) {
        res.error = user
        return
    }

    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.write(JSON.stringify({
        success: true,
        user
    }));
    res.end();
}

module.exports = { addUser, updateUser, getUser }