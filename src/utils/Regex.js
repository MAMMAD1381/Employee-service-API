class Regex{
    static regexID(id){
        const idRegex = /^\d{5}$/
        return idRegex.test(id)
    }

    static regexUsername(username){
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/
        return usernameRegex.test(username)
    }

    static regexPass(pass){
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return passwordRegex.test(pass)
    }

    static regexNationalID(NID){
        const nationalIdRegex = /^[a-zA-Z0-9]{6,}$/
        return nationalIdRegex.test(NID)
    }

    static regexCommonText(text, {hasChar, hasNum, length}){
        let regexString = '^';

        if (hasChar) {
          regexString += '(?=.*[a-zA-Z])';
        }
    
        if (hasNum) {
          regexString += '(?=.*\\d)';
        }
    
        regexString += `[a-zA-Z\\d]{${length},}$`;
    
        commonTextRegex = new RegExp(regexString);

        return commonTextRegex.test(text)
    }

    static gender(gender){
        return gender === 'male' || gender === 'female'
    }

    static regexEmail(email){
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email)
    }

    static regexPhone(phone){
        const phoneRegex = /^[\d\s.-]+$/;
        return phoneRegex.test(phone)
    }
}

module.exports = Regex