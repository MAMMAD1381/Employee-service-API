const Regex = require("../../utils/Regex");

const postRouteParamSchema = {
    id: {
        toMatch: Regex.id,
        required: true
    }
}

module.exports = postRouteParamSchema