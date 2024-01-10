// services/UserService.js
const CustomError = require('../utils/CustomError');
const UserRepository = require('../repositories/UserRepository');
const UserRules = require('../rules/UserRules')


class UserService {
  static async create(body) {
    const { id, data, parentID } = body;

    await UserRules.creation(id, parentID)

    const newUser = await UserRepository.createUser(id,data,parentID)

    return newUser
  }

  static async update(body) {
    const {id, data, parentID } = body;

    await UserRules.updating(id, parentID)

    const updatedUser = await UserRepository.updateUser(id, data, parentID)

    return updatedUser
  }

  static async get(id) {
    const user = await UserRepository.getUser(id)

    if (!user)
        throw new CustomError(404, 'userId not found')

    return user
  }
}

module.exports = UserService;
