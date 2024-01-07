// services/UserService.js
const CustomError = require('../utils/CustomError');
const User = require('../models/User');
const UserRepository = require('../repositories/UserRepository');
const Lock = require('../helper/Lock');

class UserService {
  static async create(Data) {
    const { data, parentID } = Data;
    const { id } = data;
    const users = await UserRepository.getUsers()
    const parents = await UserRepository.getParents()
    const isMaster = Object.keys(users).length === 0 && Object.keys(parents).length === 0 && parentID === id;
    const user = await UserRepository.getUser(id)
    const parent = await UserRepository.getUser(parentID)

    if (parent === undefined && !isMaster)
      throw new CustomError(400, `parentID doesn't exists`)

    if (user !== undefined && !isMaster)
      throw new CustomError(400, 'userID already exists')

    const newUser = await UserRepository.createUser({ ...data, parentID })

    return newUser
  }

  static async update(id, Data) {
    const { data, parentID } = Data;
    const newID = data.id

    const user = await UserRepository.getUser(id)
    const newUser = await UserRepository.getUser(newID)
    const parent = await UserRepository.getUser(parentID)


    if (user === undefined)
      throw new CustomError(400, `user id doesn't exists`)

    if (newUser !== undefined)
      throw new CustomError(400, `user id is taken`)

    if (parent === undefined)
      throw new CustomError(400, `parent id doesn't exists`)

    const updatedUser = await UserRepository.updateUser(id, {...data, parentID})

    return updatedUser
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
