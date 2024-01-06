const commonResponse = require('../utils/commonResponse')
const CustomError = require('../utils/CustomError')
const Validator = require('../utils/Validator')

class User {
    constructor(...userFields) {
        // {id, username, password, nationalID, jobSkill, jobTitle, name, family, gender, education, email, phone, parent}
        try{
            if(this.#validate(userFields)){
                this.user = {
                    id: userFields.id,
                    username: userFields.username,
                    password: this.#encryptPassword(userFields.password),
                    nationalID: userFields.nationalID,
                    jobSkill: userFields.jobSkill,
                    jobTitle: userFields.jobTitle,
                    name: userFields.name,
                    family: userFields.family,
                    gender: userFields.gender,
                    education: userFields.education,
                    email: userFields.email,
                    phone: userFields.phone,
                    parent: userFields.parent
                }
            }
        }
        catch(error){
            throw new CustomError(400, 'ModelError: validation')
        }
    }

    #encryptPassword(password){
        try{
            const { salt, hash } = Password.encryptPassword(password)
            return `${salt}:${hash}`
        }
        catch(error){
            throw new CustomError(500, 'ModelError: password encryption')
        }
    }

    #validate({ id, username, password, nationalID, jobSkill, jobTitle, name, family, gender, education, email, phone, parent }) {
        if (!Validator.validateID(id))
            throw new CustomError(400, 'ModelError: id')

        if (!Validator.validateUsername(username))
            throw new CustomError(400, 'ModelError: username')

        if (!Validator.validatePass(password))
            throw new CustomError(400, 'ModelError: pass')

        if (!Validator.validateNationalID(nationalID))
            throw new CustomError(400, 'ModelError: nationalID')

        if (!Validator.validateStr(jobSkill, { hasChar: true, hasNum: false, length: 10 }))
            throw new CustomError(400, 'ModelError: job skill')

        if (!Validator.validateStr(jobTitle, { hasChar: true, hasNum: false, length: 20 }))
            throw new CustomError(400, 'ModelError: job title')

        if (!Validator.validateStr(name, { hasChar: true, hasNum: false, length: 15 }))
            throw new CustomError(400, 'ModelError: name')

        if (!Validator.validateStr(family, { hasChar: true, hasNum: false, length: 15 }))
            throw new CustomError(400, 'ModelError: family')

        if (!Validator.validateGender(gender))
            throw new CustomError(400, 'ModelError: gender')

        if (!Validator.validateStr(education, { hasChar: true, hasNum: false, length: 15 }))
            throw new CustomError(400, 'ModelError: education')

        if (!Validator.validateEmail(email))
            throw new CustomError(400, 'ModelError: email')

        if (!Validator.validatePhone(phone))
            throw new CustomError(400, 'ModelError: phone')
    }
}

module.exports = User