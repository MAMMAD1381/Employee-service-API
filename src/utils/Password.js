const crypto = require('crypto')

class Password{
    static encryptPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return { salt, hash };
    }
    
    static verifyPassword(password, salt, storedHash) {
        const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hashToVerify === storedHash;
    } 
}

module.exports = Password