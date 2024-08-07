const CustomError = require('../errors/CustomError');
const UserRepository = require('../repositories/UserRepository');
const Password = require('../utils/Password');


class UserService {
  static async create(body) {
    const { id, data, parentID } = body;

    await rules(id, parentID, 'create')

    if (data.password) {
      const { salt, hash } = Password.encryptPassword(data.password)
      data.password = `${salt}:${hash}`
    }

    const newUser = await UserRepository.createUser(id, data, parentID)

    return newUser
  }

  static async update(body) {
    const { id, data, parentID } = body;

    await rules(id, parentID, 'update')

    if (data.password) {
      const { salt, hash } = Password.encryptPassword(data.password)
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

  static async delete(id) {
    const user = await UserRepository.getUser(id)

    if (!user || Object.keys(user).length === 0)
      throw new CustomError(404, 'userId not found')

    await UserRepository.deleteUser(id)
    await UserRepository.deleteParent(id)

    return user
  }

  static async getUsers(managerID){
    const users = await UserRepository.getUsers(managerID)

    return users
  }

  static async getUserByUsername(username){
    const user = await UserRepository.getUserByUsername(username)

    if (!user || Object.keys(user).length === 0)
      throw new CustomError(404, 'userId not found')

    user['parent'] = await UserRepository.getParent(user.nationalID)
    user.password = undefined

    return user
  }
}

const rules = async (id, parentID, operation) => {
  const user = await UserRepository.getUser(id)
  const parent = await UserRepository.getUser(parentID)

  const userExists = Object.keys(user).length !== 0
  const parentExists = Object.keys(parent).length !== 0

  switch (operation) {
    case 'create':
      const isManager = parentID === id && !parentExists

      if (!parentExists && !isManager)
        throw new CustomError(404, `parentID doesn't exists`)

      if (userExists && !isManager)
        throw new CustomError(400, 'userID already exists')

      break

    case 'update':
      if (!userExists)
        throw new CustomError(404, 'userID not found')

      if (!parentExists)
        throw new CustomError(404, `newParentID not found`)
      break

    default:
      throw new CustomError(500, 'needed rule is not defined')

  }

}

module.exports = UserService;
