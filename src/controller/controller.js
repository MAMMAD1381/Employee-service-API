const UserService = require('../services/UserService')
const commonResponse = require('../utils/commonResponse')


/**
 * adds user using User model
 * @param {Request} request
 * @param {Response} response 
 */
const addUser = async (request, response) => {
    await UserService.create(request.body)
    commonResponse(response, { message: 'user saved' }, 201)
}

/**
 * updates a user with give id using User model
 * @param {Request} request 
 * @param {Response} response 
 */
const updateUser = async (request, response) => {
    await UserService.update(request.body)
    commonResponse(response, { message: 'user updated' }, 200)
}

/**
 * returns the user associated to given id
 * @param {Request} request 
 * @param {Response} response 
 * @returns 
 */
const getUser = async (request, response) => {
    const user = await UserService.get(request.params.id)
    commonResponse(response, { user }, 200)
}

module.exports = { addUser, updateUser, getUser }