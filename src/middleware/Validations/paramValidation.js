const CustomError = require("../../errors/CustomError")

const paramValidation = async (paramSchema, request, response) => {
    const params = request.params
    if (params === undefined && Object.keys(paramSchema).length !== 0)
        throw new CustomError(400, 'params were not included')

    Object.entries(paramSchema).forEach(([key, value]) => {
        if (!params[key] && value['required'])
            throw new CustomError(400, `include ${key} in params`)

        if (!value['toMatch'].test(params[key]) && value['required'])
            throw new CustomError(400, `the ${key} in params was not formatted right`)
    });
}

module.exports = paramValidation