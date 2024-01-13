const CustomError = require('../errors/CustomError');
const UserRepository = require('../repositories/UserRepository');
const UserRules = require('../rules/UserRules');
const Password = require('../utils/Password');


class UserService {
  static async create(body) {
    const { id, data, parentID } = body;

    await UserRules.creation(id, parentID)

    const {salt, hash} = Password.encryptPassword(data.password)
    data.password = `${salt}:${hash}`
    
    const newUser = await UserRepository.createUser(id,data,parentID)

    return newUser
  }

  static async update(body) {
    const {id, data, parentID } = body;

    await UserRules.updating(id, parentID)

    if(data.password){
      const {salt, hash} = Password.encryptPassword(data.password)
      data.password = `${salt}:${hash}`
    }
    
    const updatedUser = await UserRepository.updateUser(id, data, parentID)

    return updatedUser
  }

  static async get(id) {
    const user = await UserRepository.getUser(id)

    if (!user || Object.keys(user).length === 0)
        throw new CustomError(404, 'userId not found')

    user['parent'] = await UserRepository.getParent(id)
    user.password = undefined
    
    return user
  }
}

module.exports = UserService;
