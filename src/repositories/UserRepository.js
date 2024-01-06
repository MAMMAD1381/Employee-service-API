// repositories/UserRepository.js
const Redis = require('./Redis');
const Lock = require('../helper/Lock');

class UserRepository {

    static async createUser(user){

    }

    static async updateUser(id){

    }

    static async getUser(id){

    }

    static async getUsers() {
        await Redis.changeDBindex(0);
        let users = await Redis.get('users');
        if (users === null) {
            users = {};
        } else {
            users = JSON.parse(users);
        }
        return users;
    }

    static async saveUsers(users, lock) {
        await lock.acquire();
        try {
            await Redis.changeDBindex(0);
            await Redis.set('users', JSON.stringify(users));
        } finally {
            lock.release();
        }
    }

    static async fetchParents() {
        await Redis.changeDBindex(1);
        let parents = await Redis.get('parents');
        if (parents === null) {
            parents = {};
        } else {
            parents = JSON.parse(parents);
        }
        return parents;
    }

    static async saveParents(parents, lock) {
        await lock.acquire();
        try {
            await Redis.changeDBindex(1);
            await Redis.set('parents', JSON.stringify(parents));
        } finally {
            lock.release();
        }
    }
}

module.exports = UserRepository;
