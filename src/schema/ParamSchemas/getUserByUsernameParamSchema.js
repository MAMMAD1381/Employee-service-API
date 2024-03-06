const Regex = require("../../utils/Regex");

const getUserByUsernameParamSchema = {
    username: {
        toMatch: Regex.username,
        required: true
    }
}

module.exports = getUserByUsernameParamSchema