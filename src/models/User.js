const commonResponse = require('../utils/commonResponse')
const CustomError = require('../utils/CustomError')
const Validator = require('../utils/Validator')

class User {
    constructor(...userFields) {
        // {id, username, password, nationalID, jobSkill, jobTitle, name, family, gender, education, email, phone, parent}
        try {
            if (this.#validate(...userFields)) {
                console.log(userFields.id)
                this.id = userFields.id
                this.username = userFields.username
                this.password = this.#encryptPassword(userFields.password)
                this.nationalID = userFields.nationalID
                this.jobSkill = userFields.jobSkill
                this.jobTitle = userFields.jobTitle
                this.name = userFields.name
                this.family = userFields.family
                this.gender = userFields.gender
                this.education = userFields.education
                this.email = userFields.email
                this.phone = userFields.phone
                this.parent = userFields.parent
                // return this
            }
        }
        catch (error) {
            throw new CustomError(400, 'ModelError: validation' + error.message)
        }
    }

    json() {
        return JSON.stringify({
            id: this.id,
            username: this.username, 
            password: this.password, 
            nationalID: this.nationalID, 
            jobSkill: this.jobSkill, 
            jobTitle: this.jobTitle, 
            name: this.name, 
            family: this.family, 
            gender: this.gender,
            education: this.education, 
            email: this.email, 
            phone: this.phone, 
            parent: this.parent
        })
    }

    object() {
        return {
            id: this.id,
            username: this.username, 
            password: this.password, 
            nationalID: this.nationalID, 
            jobSkill: this.jobSkill, 
            jobTitle: this.jobTitle, 
            name: this.name, 
            family: this.family, 
            gender: this.gender,
            education: this.education, 
            email: this.email, 
            phone: this.phone, 
            parent: this.parent
        }
    }


    #encryptPassword(password) {
        try {
            const { salt, hash } = Password.encryptPassword(password)
            return `${salt}:${hash}`
        }
        catch (error) {
            throw new CustomError(500, 'password encryption')
        }
    }

    #validate({ id, username, password, nationalID, jobSkill, jobTitle, name, family, gender, education, email, phone, parent }) {
        // console.log(id)
        if (!Validator.validateID(id))
            throw new CustomError(400, 'id')

        if (!Validator.validateUsername(username))
            throw new CustomError(400, 'username')

        if (!Validator.validatePass(password))
            throw new CustomError(400, 'pass')

        if (!Validator.validateNationalID(nationalID))
            throw new CustomError(400, 'nationalID')

        if (!Validator.validateStr(jobSkill, { hasChar: true, hasNum: false, length: 10 }))
            throw new CustomError(400, 'job skill')

        if (!Validator.validateStr(jobTitle, { hasChar: true, hasNum: false, length: 20 }))
            throw new CustomError(400, 'job title')

        if (!Validator.validateStr(name, { hasChar: true, hasNum: false, length: 15 }))
            throw new CustomError(400, 'name')

        if (!Validator.validateStr(family, { hasChar: true, hasNum: false, length: 15 }))
            throw new CustomError(400, 'family')

        if (!Validator.validateGender(gender))
            throw new CustomError(400, 'gender')

        if (!Validator.validateStr(education, { hasChar: true, hasNum: false, length: 15 }))
            throw new CustomError(400, 'education')

        if (!Validator.validateEmail(email))
            throw new CustomError(400, 'email')

        if (!Validator.validatePhone(phone))
            throw new CustomError(400, 'phone')
    }
}

module.exports = User