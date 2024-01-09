// repositories/UserRepository.js
const RedisRepository = require('./RedisRepository');
const Lock = require('../helper/Lock');
const User = require('../models/User');
const CustomError = require('../utils/CustomError');

class UserRepository {

    static async createUser(bodyFields){
        const users = await this.getUsers();
        const parents = await this.getParents();
        let newUser = new User(bodyFields)

        users[newUser.id] = newUser
        parents[newUser.id] = newUser.parent;
    
        await this.#saveUsers(users)
        await this.#saveParents(parents)
    
        return newUser;
    }

    static async updateUser(id, data){
        const users = await this.getUsers();
        const parents = await this.getParents();

        let updatedUser = new User(data)
        delete users[id]
        delete parents[id]

        users[updatedUser.id] = updatedUser
        parents[updatedUser.id] = updatedUser.parent

        await this.#saveUsers(users)
        await this.#saveParents(parents)
    
        return updatedUser;
    }

    static async getUser(id){
        const users = await this.getUsers()
        const user = users[id]
        return user
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
