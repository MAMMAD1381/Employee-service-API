const CustomError = require('../utils/CustomError')
const Password = require('../utils/Password')
const { Redis } = require('../utils/Redis')

/**
 * @class - represents user object in app
 */
class User {
    /**
     * this function creates a user with given Data
     * @param {object} Data - Data object which includes: id, data, parent
     * @returns Response which can return any error or user on success
     */
    static async create(Data) {
        const { data, parent } = Data
        const { id, password } = data


        const users = await this.#fetchUsers()
        const parents = await this.#fetchParents()

        // master conditions: no users, no parents
        const isMaster = Object.keys(users).length === 0 && Object.keys(parents).length === 0 && parent === id

        // parent exists ?
        if (users[parent] === undefined && !isMaster)
            return new CustomError(`parent id doesn't exists`, 404)

        // checking duplicate user id
        if (users[id] !== undefined && !isMaster)
            return new CustomError(`user with this id already exists`, 400)

        // add parent field to user
        data['parent'] = parent

        // encrypt pass
        const {salt, hash} = Password.encryptPassword(password)
        data['password'] = `${salt}:${hash}`
        users[id] = data
        await this.#saveUsers(users)


        if (parents[parent] === undefined) {
            parents[parent] = []
        }

        // push the changes to redis
        parents[parent].push(id)
        await this.#saveParents(parents)

        return users[id]
    }

    /**
     * this function updates the user with given data, like changing parent or data
     * @param {string} id - given data in url
     * @param {object} Data - given Data in body which includes: data, parent
     * @returns Response which can return any error or user on success
     */
    static async update(Data) {
        const { data, parent } = Data
        const { id, password } = data


        const users = await this.#fetchUsers()
        const parents = await this.#fetchParents()

        // parent exists ?
        if (parents[parent] === undefined)
            return new CustomError(`parent id doesn't exists`, 404)

        // checking if user exists
        if (users[id] === undefined)
            return new CustomError(`user with this id already doesn't exists`, 400)

        // update userData on redis
        // add parent field to user
        data['parent'] = parent

        // encrypt pass
        const {salt, hash} = Password.encryptPassword(password)
        data['password'] = `${salt}:${hash}`
        users[id] = data
        await this.#saveUsers(users)


        for (let p in parents) {
            parents[p].filter(element => parseInt(element) !== parseInt(id));
            let temp = []
            for (let i = 0; i < parents[p].length; i++) {
                if (parseInt(parents[p][i]) !== parseInt(id)) {
                    temp.push(parents[p][i])
                }
            }
            parents[p] = temp
        }

        parents[parent].push(id)

        await this.#saveParents(parents)

        return users[id]
    }

    /**
     * returns the certain user based on given id
     * @param {string} id 
     * @returns Response which can return any error or user on success
     */
    static async get(id) {
        const users = await this.#fetchUsers()
        if(users[id] === undefined || users[id] === null)
            return new CustomError('user with this id not found', 404)
        return users[id]
    }

    static async #fetchUsers(){
        await Redis.changeDBindex(0)
        let users = await Redis.get('users')
        if (users === null)
            users = {}
        else
            users = JSON.parse(users)

        return users
    }

    static async #saveUsers(users){
        await Redis.changeDBindex(0)
        await Redis.set('users', JSON.stringify(users))
    }

    static async #fetchParents(){
        await Redis.changeDBindex(1)
        let parents = await Redis.get('parents')
        if (parents === null) {
            parents = {}
        }
        else {
            parents = JSON.parse(parents)
        }
        return parents
    }

    static async #saveParents(parents){
        await Redis.changeDBindex(1)
        await Redis.set('parents', JSON.stringify(parents))
    }
}
module.exports = { User }