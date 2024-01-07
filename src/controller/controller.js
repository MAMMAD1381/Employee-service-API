const UserService = require('../services/UserService')
const commonResponse = require('../utils/commonResponse')
const CustomError = require('../utils/CustomError')

/**
 * adds user using User model
 * @param {Request} req 
 * @param {Response} res 
 */
const addUser = async (req, res) => {
    let body = req.body

    try{
        await UserService.create(body)
    }
    catch(error){
        throw new CustomError(500, 'failed creating user:' + error.message)
    }

    commonResponse(res, {message: 'user saved'}, 201)
}

/**
 * updates a user with give id using User model
 * @param {Request} req 
 * @param {Response} res 
 */
const updateUser = async (req, res) => {
    let body = req.body
    let id = req.params.id

    try{
        await UserService.update(id, body)
    }
    catch(error){
        throw new CustomError(500, 'failed updating user:' + error.message)
    }

    commonResponse(res, {message: 'user updated'}, 200)
}

/**
 * returns the user associated to given id
 * @param {Request} req 
 * @param {Request} res 
 * @returns 
 */
const getUser = async (req, res) => {
    let id = req.params.id

    let user
    try{
        user = await UserService.get(id)
    }
    catch(error){
        throw new CustomError(500, 'failed fetching user:' + error.message)
    }

    commonResponse(res, {user}, 200)
}

module.exports = { addUser, updateUser, getUser }