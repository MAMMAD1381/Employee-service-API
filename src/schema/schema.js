const schema = {
    body:{
        post: require('./BodySchemas/postRouteBodySchema'),
        put: require('./BodySchemas/putRouteBodySchema'),
        get: require('./BodySchemas/getRouteBodySchema')
    },
    param:{
        post: require('./ParamSchemas/postRouteParamSchema'),
        put: require('./ParamSchemas/putRouteParamSchema'),
        get: require('./ParamSchemas/getRouteParamSchema')
    }
}


module.exports = schema