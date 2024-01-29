const CustomError = require('../errors/CustomError');
const UserRepository = require('../repositories/UserRepository');
const Password = require('../utils/Password');


class UserService {
  static async create(body) {
    const { id, data, parentID } = body;

    await rules(id, parentID, 'create')

    if(data.password){
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

  static async delete(id){
    const user = await UserRepository.getUser(id)

    if (!user || Object.keys(user).length === 0)
      throw new CustomError(404, 'userId not found')

    await UserRepository.deleteUser(id)
    await UserRepository.deleteParent(id)

    return user
  }
}

const rules = async (id, parentID, operation) => {
  const user = await UserRepository.getUser(id)
  const parent = await UserRepository.getUser(parentID)

  switch (operation) {
    case 'create':
      const isMaster = (parentID === id);
      console.log(parent, user, isMaster)
      console.log(Object.keys(parent).length, isMaster, Object.keys(user).length)
      // if(isMaster) break

      if(parentID !== id)
        throw new CustomError(400, "parentId and id don't match")
        
      if (Object.keys(parent).length !== 0)
        throw new CustomError(400, `parentID already exists`)

      if (Object.keys(user).length !== 0)
        throw new CustomError(400, 'userID already exists')

      break
    // const isMaster = (await UserRepository.isDatabasesEmpty() && parentID === id);

    // if (Object.keys(parent).length === 0 && !isMaster)
    //   throw new CustomError(400, `parentID doesn't exists`)

    // if (Object.keys(user).length !== 0 && !isMaster)
    //   throw new CustomError(400, 'userID already exists')
    // break

    case 'update':
      if (Object.keys(user).length === 0)
        throw new CustomError(404, 'userID not found')

      if (Object.keys(parent).length === 0)
        throw new CustomError(404, `newParentID not found`)
      break

    default:
      throw new CustomError(500, 'needed rule is not defined')

  }

}

module.exports = UserService;
