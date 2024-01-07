const CustomError = require("../utils/CustomError")
const Validator = require("../utils/Validator")

// TODO we don't have optional fields
/**
 * middleware that validates the request for given params and bodyFields
 * @param {Request} request 
 * @param {Response} response 
 * @param {Object} {paramsName, bodyFieldsName} 
 * @returns null or CustomError
 */
const validation = async (paramsName, bodyFieldsName, request, response) => {

    let params = request.params
    let bodyFields = request.body ? request.body.data : undefined

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
    if (bodyFields !== undefined) {
        for (const key in bodyFields) {
            bodyFieldsName = bodyFieldsName.filter(field => field !== key)
            if (key === 'id') {
                if (!Validator.validateID(bodyFields[key]))
                    throw new CustomError(400, 'id')
            }
            else if (key === 'username') {
                if (!Validator.validateUsername(bodyFields[key]))
                    throw new CustomError(400, 'username')
            }
            else if (key === 'password') {
                if (!Validator.validatePass(bodyFields[key]))
                    throw new CustomError(400, 'pass')
            }
            else if (key === 'nationalID') {
                if (!Validator.validateNationalID(bodyFields[key]))
                    throw new CustomError(400, 'nationalID')
            }
            else if (key === 'jobSkill') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 10 }))
                    throw new CustomError(400, 'job skill')
            }
            else if (key === 'jobTitle') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 20 }))
                    throw new CustomError(400, 'job title')
            }
            else if (key === 'name') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 15 }))
                    throw new CustomError(400, 'name')
            }
            else if (key === 'family') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 15 }))
                    throw new CustomError(400, 'family')
            }
            else if (key === 'gender') {
                if (!Validator.validateGender(bodyFields[key]))
                    throw new CustomError(400, 'gender')
            }
            else if (key === 'education') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 15 }))
                    throw new CustomError(400, 'education')
            }
            else if (key === 'email') {
                if (!Validator.validateEmail(bodyFields[key]))
                    throw new CustomError(400, 'email')
            }
            else if (key === 'phone') {
                if (!Validator.validatePhone(bodyFields[key]))
                    throw new CustomError(400, 'phone')
            }
        }
    }


    if (paramsName.length !== 0)
        throw new CustomError(400, `pls provide the necessary params: ${paramsName.map(field => `${field}, `)}`)
    if (bodyFieldsName.length !== 0) {
        throw new CustomError(400, `pls provide the necessary fields of body: ${bodyFieldsName.map(field => `${field}, `)}`)
    }
}

module.exports = validation