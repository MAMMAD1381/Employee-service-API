// services/UserService.js
const CustomError = require('../utils/CustomError');
const UserRepository = require('../repositories/UserRepository');

class UserService {
  static async create(Data) {
    const { data, parentID } = Data;
    const { id } = data;

    const newUser = await UserRepository.createUser(id, data)

    return newUser
  }

  static async update(id, Data) {
    const { data, parentID } = Data;
    const newID = data.id

    const newUser = await UserRepository.updateUser(id, {...data, parentID})

    return newUser
  }

  static async get(id) {
    const user = await UserRepository.getUser(id)

    if(user === undefined)
      throw new CustomError(404, 'user id')

    user.password = undefined
    return user
  }
}

module.exports = UserService;
