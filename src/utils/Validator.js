const Regex = require("./Regex")
const { errResponse } = require("./utils")

class Validator{
    static validateID(id, req, res){
        if(id === null || id === undefined || !Regex.regexID(id)){
            errResponse(req, res, 'pls provide a valid id', 400)
        }
    }

    static validateUsername(username, req, res){
        if(username === null || username === undefined || !Regex.regexUsername(username)){
            errResponse(req, res, 'pls provide a valid username', 400)
        }
    }

    static validatePass(pass, req, res){
        if(pass === null || pass === undefined || !Regex.regexPass(pass)){
            errResponse(req, res, 'pls provide a valid password', 400)
        }
    }
    
    static validateNationalID(NationalID, req, res){
        if(NationalID === null || NationalID === undefined || !Regex.regexNationalID(NationalID)){
            errResponse(req, res, 'pls provide a valid NationalID', 400)
        }
    }

    static validateStr(str, options, req, res){
        if(str === null || str === undefined || !Regex.regexCommonText(str, options)){
            errResponse(req, res, 'pls provide a valid value', 400)
        }
    }

    static validateGender(gender, req, res){
        if(gender === null || gender === undefined || !Regex.gender(gender)){
            errResponse(req, res, 'pls provide a valid gender', 400)
        }
    }

    static validateEmail(email, req, res){
        if(email === null || email === undefined || !Regex.regexEmail(email)){
            errResponse(req, res, 'pls provide a valid email', 400)
        }
    }

    static validatePhone(phone, req, res){
        if(phone === null || phone === undefined || !Regex.regexPhone(phone)){
            errResponse(req, res, 'pls provide a valid phone', 400)
        }
    }
}

module.exports = Validator