const UserService = require('../services/UserService')
const commonResponse = require('../utils/commonResponse')
const CustomError = require('../utils/CustomError')

/**
 * adds user using User model
 * @param {Request} request
 * @param {Response} response 
 */
const addUser = async (request, response) => {
    try{
        await UserService.create(request.body)
        commonResponse(response, {message: 'user saved'}, 201)
    }
    catch(error){
        console.log(error.stack)
        throw new CustomError(500, 'failed creating user:' + error.message)
    }
}

/**
 * updates a user with give id using User model
 * @param {Request} request 
 * @param {Response} response 
 */
const updateUser = async (request, response) => {
    try{
        await UserService.update(request.params.id, request.body)
        commonResponse(response, {message: 'user updated'}, 200)
    }
    catch(error){
        throw new CustomError(500, 'failed updating user:' + error.message)
    }
}

/**
 * returns the user associated to given id
 * @param {Request} request 
 * @param {Response} response 
 * @returns 
 */
const getUser = async (request, response) => {
    try{
        const user = await UserService.get(request.params.id)
        commonResponse(response, {user}, 200)
    }
    catch(error){
        throw new CustomError(500, 'failed fetching user:' + error.message)
    }
}

module.exports = { addUser, updateUser, getUser }