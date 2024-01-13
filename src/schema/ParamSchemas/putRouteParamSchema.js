const Regex = require("../../utils/Regex");

const putRouteParamSchema = {
    id: {
        toMatch: Regex.id,
        required: true
    }
}

module.exports = putRouteParamSchema