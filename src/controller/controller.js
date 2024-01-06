const { User } = require('../model/User')
const commonResponse = require('../utils/commonResponse')

/**
 * adds user using User model
 * @param {Request} req 
 * @param {Response} res 
 */
const addUser = async (req, res) => {
    // add user using User model
    let body = req.body
    await User.create(body)

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
    // update user
    await User.update(id, body)
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
    let user = await User.get(id)

    commonResponse(res, {user}, 200)
}

module.exports = { addUser, updateUser, getUser }