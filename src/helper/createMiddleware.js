const createMiddleware = (func, ...args) => {
    return function (...args2) {
        const response = func(...args, ...args2)
        return response
    }
}

module.exports = createMiddleware