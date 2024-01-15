const CustomError = require("../../errors/CustomError")

/**
 * a middleware that is responsible for validation of params
 * if there is no error it will pass to next middlewares
 * @param {object} paramSchema 
 * @example
 * const paramSchema = {
 *      id: {
 *          toMatch: /regex/,
 *          required: true        
 *      }
 * }
 * router.route('somePath').get(..., paramValidation(paramSchema), ...)
 */
const paramValidation = (paramSchema) => async (request, response) => {
    const params = request.params
    if (params === undefined && Object.keys(paramSchema).length !== 0)
        throw new CustomError(400, 'params were not included')

    Object.entries(paramSchema).forEach(([key, value]) => {
        if (!params[key] && value['required'])
            throw new CustomError(400, `include ${key} in params`)

        if (!value['toMatch'].test(params[key]) && value['required'])
            throw new CustomError(400, `the ${key} in params was not formatted right`)
    });
  };

module.exports = paramValidation