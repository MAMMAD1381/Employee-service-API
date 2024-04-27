const Regex = require("../../utils/Regex");

const getUsersRouteParamSchema = {
    parentID: {
        toMatch: Regex.id,
        required: true
    }
}

module.exports = getUsersRouteParamSchema