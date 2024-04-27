const Regex = require("../../utils/Regex");

const getRouteParamSchema = {
    id: {
        toMatch: Regex.id,
        required: true
    }
}

module.exports = getRouteParamSchema