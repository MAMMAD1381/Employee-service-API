const CustomError = require("../../errors/CustomError")

/**
 * Middleware for validating request body based on specified schema.
 * if there is nothing wrong with fields it will pass to other middlewares
 * @param {object} bodySchema - an object that represents the fields and regex and requirity of the field
 * @returns 
 * 
 * @example
 * const bodySchema = {
    * id: {
    *      toMatch: /regex/,
    *      required: true
    * },
    * data: {
    *      toMatch: /regex/
    * }
 * }
 * 
 * router.route('/users').post(bodyValidation(bodySchema), ...other middlewares and controller)
 */
const bodyValidation = (bodySchema) => async(request, response) => {
    if (Object.keys(bodySchema).length)
        validationBody(bodySchema, request.body)
}

/**
 *  a recursive function that does the validation, even for nested objects
 * @param {object} bodySchema 
 * @param {object} body 
 */
const validationBody = (bodySchema, body) => {
    if (body === undefined)
        throw new CustomError(400, 'body was not included')

    Object.entries(bodySchema).forEach(([key, value]) => {
        if (Object.keys(value).length > 2)
            validationBody(value, body[key])
        else if (Object.keys(value).length > 0) {

            if (!body[key] && value['required'])
                throw new CustomError(400, `include ${key} in body`)

            if (!value['toMatch'].test(body[key]) && value['required'])
                throw new CustomError(400, `the ${key} in body was not formatted right`)
        }
    });
}

module.exports = bodyValidation