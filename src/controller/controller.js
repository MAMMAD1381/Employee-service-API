const UserService = require('../services/UserService')
const commonResponse = require('../utils/commonResponse')
const CustomError = require('../utils/CustomError')

/**
 * adds user using User model
 * @param {Request} request
 * @param {Response} response 
 */
const addUser = async (request, response) => {
    let body = request.body

    try{
        await UserService.create(body)
    }
    catch(error){
        console.log(error.stack)
        throw new CustomError(500, 'failed creating user:' + error.message)
    }

    commonResponse(response, {message: 'user saved'}, 201)
}

/**
 * updates a user with give id using User model
 * @param {Request} request 
 * @param {Response} response 
 */
const updateUser = async (request, response) => {
    let body = request.body
    let id = request.params.id

    try{
        await UserService.update(id, body)
    }
    catch(error){
        throw new CustomError(500, 'failed updating user:' + error.message)
    }

    commonResponse(response, {message: 'user updated'}, 200)
}

/**
 * returns the user associated to given id
 * @param {Request} request 
 * @param {Response} response 
 * @returns 
 */
const getUser = async (request, response) => {
    let id = request.params.id

    let user
    try{
        user = await UserService.get(id)
    }
    catch(error){
        throw new CustomError(500, 'failed fetching user:' + error.message)
    }

    commonResponse(response, {user}, 200)
}

module.exports = { addUser, updateUser, getUser }