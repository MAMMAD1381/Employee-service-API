const commonResponse = require('../utils/commonResponse')
const CustomError = require('../utils/CustomError')
const Validator = require('../utils/Validator')
const Password = require('../utils/Password')

class User {
    constructor(userFields) {
        // {id, username, password, nationalID, jobSkill, jobTitle, name, family, gender, education, email, phone, parent}
        console.log('user fields', userFields.id)

        try {
            if (this.#validate(userFields)) {
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
                this.parent = userFields.parentID
                // return this
            }
        }
        catch (error) {
            console.log(error.stack)
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
            console.log('password', password)
            const { salt, hash } = Password.encryptPassword(password)
            console.log(salt, hash)
            return `${salt}:${hash}`
        }
        catch (error) {
            throw new CustomError(500, 'password encryption')
        }
    }

    #validate({ id, username, password, nationalID, jobSkill, jobTitle, name, family, gender, education, email, phone, parent }) {
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

        return true
    }
}

module.exports = User