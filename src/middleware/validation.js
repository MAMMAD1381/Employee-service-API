const CustomError = require("../errors/CustomError")
const Validator = require("../utils/Validator")

/**
 * middleware that validates the request for given params and bodyFields
 * @param {Request} request 
 * @param {Response} response 
 * @param {Object} {paramsName, bodyFieldsName} 
 * @returns null or CustomError
 */
const validation = async (paramsName, bodySchema, request, response) => {

    let params = request.params

    // params validation
    if (params !== undefined)
        for (let param in params) {
            paramsName = paramsName.filter(field => field !== param)
            if (param === 'id') {
                if (!Validator.validateID(params[param]))
                    throw new CustomError(400, 'bad id')
            }
        }

    // body validation
    validationBody(bodySchema, request.body)



    if (paramsName.length !== 0)
        throw new CustomError(400, `pls provide the necessary params: ${paramsName.map(field => `${field}, `)}`)

}

const validationBody = (bodySchema, body) => {
    if (body == undefined)
        throw new CustomError(400, 'body was not included')

    Object.entries(bodySchema).forEach(([key, value]) => {
        if (Object.keys(value).length > 2)
            validationBody(value, body[key])
        else if (Object.keys(value).length > 0) {

            if (!body[key] && value['required'])
                throw new CustomError(400, `include ${key} in body`)

            if (!value['toMatch'].test(body[key]) && value['required'])
                throw new CustomError(400, `the ${key} was not formatted right`)
        }
    });
}

module.exports = validation