// repositories/UserRepository.js
const RedisRepository = require('./RedisRepository');
const Lock = require('../helper/Lock');
const User = require('../models/User');
const CustomError = require('../utils/CustomError');

class UserRepository {

    static async createUser(bodyFields){
        const users = await UserRepository.getUsers();
        const parents = await UserRepository.getParents();
        // console.log(bodyFields)
        let newUser = new User(bodyFields)
        newUser = newUser.object()
        // console.log(newUser)
        users[newUser.id] = newUser
        parents[newUser.id] = newUser.parent;
            
    
        await UserRepository.#saveUsers(users)
        await UserRepository.#saveParents(parents)
    
        return newUser;
    }

    static async updateUser(id){

    }

    static async getUser(id){

    }

    static async getUsers() {
        await RedisRepository.changeDBindex(0);
        let users = await RedisRepository.get('users');
        if (users === null) {
            users = {};
        } else {
            users = JSON.parse(users);
        }
        return users;
    }

    static async #saveUsers(users) {
        try {
            await RedisRepository.changeDBindex(0);
            await RedisRepository.set('users', JSON.stringify(users));
        } catch(error) {
            throw CustomError(500, 'saving users')
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
}

module.exports = UserRepository;
