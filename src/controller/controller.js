const { User } = require('../models/User')
const UserService = require('../services/UserService')
const commonResponse = require('../utils/commonResponse')

/**
 * adds user using User model
 * @param {Request} req 
 * @param {Response} res 
 */
const addUser = async (req, res) => {
    let body = req.body

    await UserService.create(body)

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

    await UserService.update(id, body)

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
    
    let user = await UserService.get(id)

    commonResponse(res, {user}, 200)
}

module.exports = { addUser, updateUser, getUser }