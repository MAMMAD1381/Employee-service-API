const CustomError = require("../src/utils/CustomError")
const { getReqData } = require("../src/utils/utils")
const Validator = require("../src/utils/Validator")

const validation = async (req, res, { paramsName, bodyFieldsName }) => {
    let params = req.params
    let bodyFields = await getReqData(req)
    if (bodyFields) {
        bodyFields = JSON.parse(bodyFields)
        bodyFields = bodyFields.data
    }
    else {
        bodyFields = null
    }

    req.body = bodyFields
    // console.log(bodyFields)
    if (params !== undefined)
        for (let param in params) {
            switch (param) {
                case 'id':
                    if (!Validator.validateID(params[param])) {
                        return new CustomError('pls provide an id in parameters', 400)
                    }
                    break
            }
        }



    if (bodyFields !== undefined) {
        for (const key in bodyFields) {
            // console.log(key, bodyFields[key])
            if (key === 'id') {
                if (!Validator.validateID(bodyFields[key]))
                    return new CustomError('pls provide a correct id', 400)
            }
            else if (key === 'username') {
                if (!Validator.validateUsername(bodyFields[key]))
                    return new CustomError('pls provide a correct username', 400)
            }
            else if (key === 'password') {
                if (!Validator.validatePass(bodyFields[key]))
                    return new CustomError('pls provide a correct pass', 400)
            }
            else if (key === 'nationalID') {
                if (!Validator.validateNationalID(bodyFields[key]))
                    return new CustomError('pls provide a correct national id', 400)
            }
            else if (key === 'jobSkill') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 10 }))
                    return new CustomError('pls provide a correct job skill', 400)
            }
            else if (key === 'jobTitle') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 20 }))
                    return new CustomError('pls provide a correct job title', 400)
            }
            else if (key === 'name') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 15 }))
                    return new CustomError('pls provide a correct name', 400)
            }
            else if (key === 'family') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 15 }))
                    return new CustomError('pls provide a correct family', 400)
            }
            else if (key === 'gender') {
                if (!Validator.validateGender(bodyFields[key]))
                    return new CustomError('pls provide a correct gender', 400)
            }
            else if (key === 'education') {
                if (!Validator.validateStr(bodyFields[key], { hasChar: true, hasNum: false, length: 15 }))
                    return new CustomError('pls provide a correct education', 400)
            }
            else if (key === 'email') {
                if (!Validator.validateEmail(bodyFields[key]))
                    return new CustomError('pls provide a correct email', 400)
            }
            else if (key === 'phone') {
                if (!Validator.validatePhone(bodyFields[key]))
                    return new CustomError('pls provide a correct phone number', 400)
            }
            
        }
    }

    return null

}

module.exports = validation