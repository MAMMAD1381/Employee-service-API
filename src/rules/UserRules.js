const UserRepository = require('../repositories/UserRepository')
const CustomError = require('../utils/CustomError')

class UserRules {

    static async creation(id, parentID) {
        const isMaster = (await UserRepository.isDatabasesEmpty() && parentID === id);
        const user = await UserRepository.getUser(id)
        const parent = await UserRepository.getUser(parentID)
        if ((!parent) && !isMaster)
            throw new CustomError(400, `parentID doesn't exists`)

        if ((user) && !isMaster)
            throw new CustomError(400, 'userID already exists')
    }

    static async updating(id, parentID) {
        const user = await UserRepository.getUser(id)
        const parent = await UserRepository.getUser(parentID)

        if (!user)
            throw new CustomError(404, 'userID not found')

        if (!parent)
            throw new CustomError(404, `newParentID not found`)
    }

    static async retrieving(id) {
        const user = await UserRepository.getUser(id)

        if (!user)
            throw new CustomError(404, 'userId not found')

        return user
    }

}


module.exports = UserRules