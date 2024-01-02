const Password = require('../utils/Password')

const generateToken = async (user) => {
    const { salt, hash } = await Password.encrypt(JSON.stringify(user))
    const token = `${salt}:${hash}`
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour in milliseconds
    const formattedExpirationTime = expirationTime.toUTCString();
    const cookieValue = `token=${token}; Expires=${formattedExpirationTime}; HttpOnly`
    return cookieValue
}

const verifyToken = async(user, token) => {
    const {salt, hash} = token.split(':')
    const isVerified = await Password.verify(JSON.stringify(user), salt, hash)
    console.log(isVerified)
}

module.exports = {generateToken, verifyToken}