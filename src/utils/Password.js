const crypto = require('crypto')

class Password{
    /**
     * 
     * @param {String} password 
     * @returns {salt, hash} - salt is needed for verification
     */
    static encryptPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return { salt, hash };
    }
    
    /**
     * 
     * @param {String} password 
     * @param {String} salt 
     * @param {String} storedHash 
     * @returns {boolean} if hashed === givenHash
     */
    static verifyPassword(password, salt, storedHash) {
        const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hashToVerify === storedHash;
    } 
}

module.exports = Password