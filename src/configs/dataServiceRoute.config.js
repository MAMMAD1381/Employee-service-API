const createMiddleware = require('../helper/createMiddleware')
const paramParser = require('../middleware/paramParser')
const validation = require('../middleware/validation')


const routingRoutes = {
    get: '/dataService/:id',
    post: '/dataService',
    put: '/dataService'
}

const paramParserMiddlewares = {
    get: createMiddleware(paramParser, routingRoutes.get),
    post: createMiddleware(paramParser, routingRoutes.post),
    put: createMiddleware(paramParser, routingRoutes.put)
}

const validationMiddlewares = {
    get: createMiddleware(validation, ['id'], []),
    post: createMiddleware(validation, [], ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education']),
    put: createMiddleware(validation, [], ['username', 'password', 'nationalID', 'jobSkill', 'jobTitle', 'name', 'family', 'gender', 'education'])
}

module.exports = {
    routingRoutes,
    paramParserMiddlewares,
    validationMiddlewares
}