const bodySchema = {
    post: require('./BodySchemas/postRouteBodySchema'),
    put: require('./BodySchemas/putRouteBodySchema'),
    get: require('./BodySchemas/getRouteBodySchema')
}

module.exports = bodySchema