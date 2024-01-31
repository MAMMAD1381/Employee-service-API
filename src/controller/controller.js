const customErrorHandler = require('../errors/customErrorHandler')
const UserService = require('../services/UserService')
const commonResponse = require('../utils/commonResponse')


/**
 * controller for adding new users
 * @param {Request} request
 * @param {Response} response 
 */
const addUser = async (request, response) => {
    try {
        await UserService.create(request.body)
        commonResponse(response, { message: 'user saved' }, 201)
    }
    catch (error) {
        await customErrorHandler(error, response)
    }
}

/**
 * controller for updating users
 * @param {Request} request 
 * @param {Response} response 
 */
const updateUser = async (request, response) => {
    try {
        await UserService.update(request.body)
        commonResponse(response, { message: 'user updated' }, 200)
    }
    catch (error) {
        await customErrorHandler(error, response)
    }

}

/**
 * returns the user associated to given id
 * @param {Request} request 
 * @param {Response} response 
 */
const getUser = async (request, response) => {
    try {
        const user = await UserService.get(request.params.id)
        commonResponse(response, { user }, 200)
    }
    catch (error) {
        await customErrorHandler(error, response)
    }
}

const deleteUser = async (request, response) => {
    try {
        await UserService.delete(request.params.id)
        commonResponse(response, { message: 'user deleted successfully' }, 200)
    }
    catch (error) {
        await customErrorHandler(error, response)
    }
}

const getUsers = async (request, response) => {
    try {
        const users = await UserService.getUsers(request.params.parentID)
        // const test = users.reduce((acc, obj) => {
        //     acc[obj.id] = obj;
        //     return acc;
        //   }, {});
        //   console.log(test)
        commonResponse(response, { count: users.length, users }, 200)
    }
    catch (error) {
        await customErrorHandler(error, response)
    }
}
module.exports = { addUser, updateUser, getUser, deleteUser ,getUsers }