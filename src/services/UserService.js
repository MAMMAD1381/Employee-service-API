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
    // console.log(Object.keys(users).length, Object.keys(parents).length, parentID , id, isMaster)
    const user = await UserRepository.getUser(id)
    const parent = await UserRepository.getUser(parentID)

    if(parent === undefined && !isMaster)
        throw new CustomError(400, `parentID doesn't exists`)

    if(user !== undefined && !isMaster)
        throw new CustomError(400, 'user already id exists')
    console.log('user service', {id, ...data, parentID})
    const newUser = await UserRepository.createUser({...data, parentID})

    return newUser
    


    // const users = await UserRepository.fetchUsers();
    // const parents = await UserRepository.fetchParents();

    

    // if (users[parent] === undefined && !isMaster) {
    //   throw new CustomError(404, `parent`);
    // }

    // if (users[id] !== undefined && !isMaster) {
    //   throw new CustomError(400, `user exists`);
    // }

    // data['parent'] = parent;
    // const newUser = User.create(data, parent);

    // users[id] = data;
    // parents[id] = parent;

    // const lock = new Lock();
    // await Promise.all([UserRepository.saveUsers(users, lock), UserRepository.saveParents(parents, lock)]);

    // return newUser;
  }

  static async update(id, Data) {
    const { data, parent } = Data;

    const users = await UserRepository.fetchUsers();
    const parents = await UserRepository.fetchParents();

    if (parents[parent] === undefined) {
      throw new CustomError(404, `parent`);
    }

    if (users[id] === undefined) {
      throw new CustomError(400, `user exists`);
    }

    const newUser = User.create(data, parent);

    delete users[id];
    delete parents[id];
    data['parent'] = parent;
    users[newUser.id] = data;
    parents[newUser.id] = parent;

    const lock = new Lock();
    await Promise.all([UserRepository.saveUsers(users, lock), UserRepository.saveParents(parents, lock)]);

    return newUser;
  }

  static async get(id) {
    const users = await UserRepository.fetchUsers();
    const user = users[id];

    if (user === undefined || user === null) {
      throw new CustomError(404, 'user');
    }

    return user;
  }
}

module.exports = UserService;
