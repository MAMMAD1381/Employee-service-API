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
     * @returns user or CustomError - Response which can return any error or user on success
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
            throw new CustomError(404, `parent`)

        // checking duplicate user id
        if (users[id] !== undefined && !isMaster)
            throw new CustomError(400, `user exists`)

        // add parent field to user
        data['parent'] = parent

        // encrypt pass
        const { salt, hash } = Password.encryptPassword(password)
        data['password'] = `${salt}:${hash}`
        users[id] = data
        await this.#saveUsers(users)

        parents[id] = parent

        // push the changes to redis
        await this.#saveParents(parents)

        return users[id]
    }

    /**
     * this function updates the user with given data, like changing parent or data
     * @param {string} id - given data in url
     * @param {object} Data - given Data in body which includes: data, parent
     * @returns user or CustomError - Response which can return any error or user on success
     */
    static async update(id, Data) {
        const { data, parent } = Data
        const { password } = data

        console.log(id)

        const users = await this.#fetchUsers()
        const parents = await this.#fetchParents()

        // parent exists ?
        if (parents[parent] === undefined)
            throw new CustomError(404, `parent`)

        // checking if user exists
        if (users[id] === undefined)
            throw new CustomError(400, `user exists`)

        // encrypt pass
        const { salt, hash } = Password.encryptPassword(password)
        data['password'] = `${salt}:${hash}`

        // add parent field to user
        let newID = data.id

        delete users[id]
        delete parents[id]
        data['parent'] = parent
        users[newID] = data
        parents[newID] = parent

        await this.#saveUsers(users)
        await this.#saveParents(parents)

        return users[newID]
    }

    /**
     * returns the certain user based on given id
     * @param {string} id 
     * @returns user or CustomError - Response which can return any error or user on success
     */
    static async get(id) {
        const users = await this.#fetchUsers()
        const user = users[id]
        if (user === undefined || user === null)
            throw new CustomError(404, 'user')
        user.password = undefined
        return user
    }

    /**
     * fetches users using Redis
     * @returns users
     */
    static async #fetchUsers() {
        await Redis.changeDBindex(0)
        let users = await Redis.get('users')
        if (users === null)
            users = {}
        else
            users = JSON.parse(users)

        return users
    }

    /**
     * saves the users into redis
     * @param {Object} users 
     */
    static async #saveUsers(users) {
        await Redis.changeDBindex(0)
        await Redis.set('users', JSON.stringify(users))
    }

    /**
    * fetches parents using Redis
    * @returns parents
    */
    static async #fetchParents() {
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

    /**
     * saves parents using Redis
     * @returns users
     */
    static async #saveParents(parents) {
        await Redis.changeDBindex(1)
        await Redis.set('parents', JSON.stringify(parents))
    }
}
module.exports = { User }