// services/UserService.js
const CustomError = require('../utils/CustomError');
const UserRepository = require('../repositories/UserRepository');

class UserService {
  static async create(Data) {
    const { id, data, parentID } = Data;
    // const isMaster = (await UserRepository.isDatabasesEmpty() && parentID === id);

    // const user = await UserRepository.getUser(id)
    // const parent = await UserRepository.getUser(parentID)
    // console.log(parent, user)

    // if (!parent && !isMaster)
    //   throw new CustomError(400, `parentID doesn't exists`)

    // if (user && !isMaster)
    //   throw new CustomError(400, 'userID already exists')
    // try {
      userCreationRules(id, parentID)
    // }
    // catch (error) {
    //   console.log(error.stack)
    //   throw error
    // }

    const newUser = await UserRepository.createUser(id, data, parentID)

    return newUser
  }

  static async update(id, Data, parentID) {
    // const {data, parentID } = Data;

    const newUser = await UserRepository.updateUser(id, { ...data, parentID })

    return newUser
  }

  static async get(id) {
    const user = await UserRepository.getUser(id)

    if (user === undefined)
      throw new CustomError(404, 'user id')

    user.password = undefined
    return user
  }
}

module.exports = UserService;

const userCreationRules = async (id, parentID) => {
  const isMaster = (await UserRepository.isDatabasesEmpty() && parentID === id);

  const user = await UserRepository.getUser(id)
  const parent = await UserRepository.getUser(parentID)
  console.log(parent, user)

  if ((!parent || Object.keys(parent).length === 0) && !isMaster)
    throw new CustomError(400, `parentID doesn't exists`)

  if ((user || Object.keys(user).length !== 0) && !isMaster)
    throw new CustomError(400, 'userID already exists')

}
