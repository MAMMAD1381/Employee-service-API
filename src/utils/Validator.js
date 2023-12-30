const CustomError = require("./CustomError")
const Regex = require("./Regex")
const { errResponse } = require("./utils")

class Validator{
    static validateID(id){
        return id === null || id === undefined || !/^\d{5}$/.test(id)
    }

    static validateUsername(username){
        return username === null || username === undefined || !/^[a-zA-Z0-9_]{3,16}$/.test(username)
    }

    static validatePass(pass){
        return pass === null || pass === undefined || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass)
    }
    
    static validateNationalID(NationalID){
        return NationalID === null || NationalID === undefined || !/^[a-zA-Z0-9]{6,}$/.test(NationalID)
    }

    static validateStr(str, {hasChar, hasNum, length}){
        let regexString = '^';

        if (hasChar) {
          regexString += '(?=.*[a-zA-Z])';
        }
    
        if (hasNum) {
          regexString += '(?=.*\\d)';
        }
    
        regexString += `[a-zA-Z\\d]{${length},}$`;
    
        const commonTextRegex = new RegExp(regexString);
        return str === null || str === undefined || !commonTextRegex.test(str)
    }

    static validateGender(gender){
        return gender === 'male' || gender === 'female'
    }

    static validateEmail(email){
        return email === null || email === undefined || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    }

    static validatePhone(phone){
        return phone === null || phone === undefined || !/^[\d\s.-]+$/.test(phone)
    }
}

module.exports = Validator