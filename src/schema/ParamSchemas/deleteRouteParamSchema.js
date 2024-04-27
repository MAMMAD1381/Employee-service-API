const Regex = require("../../utils/Regex");

const deleteRouteParamSchema = {
    id: {
        toMatch: Regex.id,
        required: true
    }
}

module.exports = deleteRouteParamSchema