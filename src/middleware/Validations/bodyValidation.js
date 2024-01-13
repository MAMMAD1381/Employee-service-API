const CustomError = require("../../errors/CustomError")


const bodyValidation = async (bodySchema, request, response) => {
    if (Object.keys(bodySchema).length)
        validationBody(bodySchema, request.body)
}

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