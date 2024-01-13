const paramSchema = {
    post: require('./ParamSchemas/postRouteParamSchema'),
    put: require('./ParamSchemas/putRouteParamSchema'),
    get: require('./ParamSchemas/getRouteParamSchema')
}

module.exports = paramSchema