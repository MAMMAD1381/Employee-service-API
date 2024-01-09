// repositories/UserRepository.js
// const RedisRepository = require('./RedisRepository');
const Lock = require('../helper/Lock');
const User = require('../models/User');
const CustomError = require('../utils/CustomError');
const RedisModel = require('../models/RedisModel');
// const { isDatabaseEmpty } = require('../models/RedisModel');

class UserRepository {

    static async createUser(id, data, parentID){
        const newUser = await RedisModel.addUser(id, data)
        await RedisModel.addParent(id, parentID)
        console.log(newUser)
        return newUser
    }

    static async updateUser(id, data){

        // RedisModel.getParent(id)
        // await RedisModel.getParents()
        // await RedisModel.getUsers()

        await RedisModel.isDatabaseEmpty(0)
        // await RedisModel.isE
        return
        const updatedUser =  await RedisModel.updateUser(id, data)
        console.log(updatedUser)
        return updatedUser
        // const users = await this.getUsers();
        // const parents = await this.getParents();

        // let updatedUser = new User(data)
        // delete users[id]
        // delete parents[id]

        // users[updatedUser.id] = updatedUser
        // parents[updatedUser.id] = updatedUser.parent

        // // await this.#saveUsers(users)
        // await this.#saveParents(parents)
    
        // return updatedUser;
    }

    static async getUser(id){
        const user = await RedisModel.getUser(id)
        console.log(user)
        return user
    }

    static async getUsers() {
        // await RedisRepository.changeDBindex(0);
        const users = await RedisModel.getUsers()
        return users
        // let users = await RedisRepository.get('users');
        // if (users === null) {
        //     users = {};
        // } else {
        //     users = JSON.parse(users);
        // }
        // return users;
    }

    static async #saveUser(user) {
        try {
            await RedisRepository.changeDBindex(0);
            await RedisRepository.set(user.id, user);
        } catch(error) {
            throw CustomError(500, 'saving user')
        }
    }

    static async getParents() {
        await RedisRepository.changeDBindex(1);
        let parents = await RedisRepository.get('parents');
        if (parents === null) {
            parents = {};
        } else {
            parents = JSON.parse(parents);
        }
        return parents;
    }

    static async #saveParents(parents) {
        try {
            await RedisRepository.changeDBindex(1);
            await RedisRepository.set('parents', JSON.stringify(parents));
        } catch {
            throw CustomError(500, 'saving parents')
        }
    }

    static async isDatabasesEmpty(){
        return (await RedisModel.isDatabaseEmpty(0) && await RedisModel.isDatabaseEmpty(1))
    }
}

module.exports = UserRepository;
