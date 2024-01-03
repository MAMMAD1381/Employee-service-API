const CustomError = require("../utils/CustomError")
const { getReqData } = require("../utils/utils")
const Validator = require("../utils/Validator")

// TODO we don't have optional fields
/**
 * middleware that validates the request for given params and bodyFields
 * @param {Request} req 
 * @param {Response} res 
 * @param {Object} {paramsName, bodyFieldsName} 
 * @returns null or CustomError
 */
const validation = async (paramsName, bodyFieldsName, req, res) => {

    let params = req.params
    let bodyFields = req.body.data
    // let bodyFields = body ? body.data : undefined

    // params validation
    if (params !== undefined)
        for (let param in params) {
            paramsName = paramsName.filter(field => field !== param)
            if (param === 'id') {
                if (!Validator.validateID(params[param]))
                    throw new CustomError('pls provide a correct id', 400)
            }
        }

    // body validation
    if (bodyFields !== undefined) {
        for (const key in bodyFields) {
            bodyFieldsName = bodyFieldsName.filter(field => field !== key)
            if (key === 'id') {
                if (!Validator.validateID(bodyFields[key]))
                    throw new CustomError('pls provide a correct id', 400)
            }
            else if (key === 'username') {
                if (!Validator.validateUsername(bodyFields[key]))
                    throw new CustomError('pls provide a correct username', 400)
            }
            else if (key === 'password') {
                if (!Validator.validatePass(bodyFields[key]))
                    throw new CustomError('pls provide a correct pass', 400)
            }
            else if (key === 'nationalID') {
                if (!Validator.validateNationalID(bodyFields[key]))
                    throw new CustomError('pls provide a correct national id', 400)
            }
            else if (key === 'jobSkill') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 10 }))
                    throw new CustomError('pls provide a correct job skill', 400)
            }
            else if (key === 'jobTitle') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 20 }))
                    throw new CustomError('pls provide a correct job title', 400)
            }
            else if (key === 'name') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 15 }))
                    throw new CustomError('pls provide a correct name', 400)
            }
            else if (key === 'family') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 15 }))
                    throw new CustomError('pls provide a correct family', 400)
            }
            else if (key === 'gender') {
                if (!Validator.validateGender(bodyFields[key]))
                    throw new CustomError('pls provide a correct gender', 400)
            }
            else if (key === 'education') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 15 }))
                    throw new CustomError('pls provide a correct education', 400)
            }
            else if (key === 'email') {
                if (!Validator.validateEmail(bodyFields[key]))
                    throw new CustomError('pls provide a correct email', 400)
            }
            else if (key === 'phone') {
                if (!Validator.validatePhone(bodyFields[key]))
                    throw new CustomError('pls provide a correct phone number', 400)
            }
        }
    }


    if (paramsName.length !== 0)
        throw new CustomError(`pls provide the necessary params: ${paramsName.map(field => `${field}, `)}`, 400)
    if (bodyFieldsName.length !== 0) {
        throw new CustomError(`pls provide the necessary fields of body: ${bodyFieldsName.map(field => `${field}, `)}`, 400)
    }
}

module.exports = validation