const { User } = require('../model/User')
const CustomError = require('../utils/CustomError')

/**
 * adds user using User model
 * @param {Request} req 
 * @param {Response} res 
 */
const addUser = async (req, res) => {
    // add user using User model
    let body = req.body
    const user = await User.create(body)

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
    let body = req.body
    // update user
    let user = await User.update(body)

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
    let id = req.params.id
    let user = await User.get(id)

    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.write(JSON.stringify({
        success: true,
        user
    }));
    res.end();
}

module.exports = { addUser, updateUser, getUser }