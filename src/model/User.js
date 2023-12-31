const CustomError = require('../utils/CustomError')
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
        const { id, username, password, nationalID, jobSkill, jobTitle, name, family, gender, education, email, phone } = data


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

        // save the changes to db
        data['parent'] = parent
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
    static async update(id, Data) {
        const { data, parent } = Data
        let response = {
            user: {},
            error: ''
        }

        // validation for given id and Data
        if (id === null || id === undefined) {
            response.error = 'pls provide an id'
            return response
        }
        if (data === null || data === undefined) {
            response.error = 'pls provide data'
            return response
        }
        if (parent === null || parent === undefined) {
            response.error = 'pls provide a parent id'
            return response
        }

        // check if parent exists on userData
        let userData = await Redis.get('data')
        if (userData === null) {
            userData = {}
        }
        else {
            userData = JSON.parse(userData)
        }
        // checking duplicate user id
        if (userData[id] === undefined) {
            response.error = `user with this id doesn't exists`
            return response
        }

        // update userData on redis
        userData[id] = data
        await Redis.set('data', JSON.stringify(userData))

        let parents = await Redis.get('parents')
        if (parents === null) {
            parents = {}
        }
        else {
            parents = JSON.parse(parents)
        }
        if (parents[parent] === undefined) {
            response.error = `given parent id doesn't exists`
            return response
        }

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

        await Redis.set('parents', JSON.stringify(parents))
        response.user = { id, data: userData[id] }
        return response
    }

    /**
     * returns the certain user based on given id
     * @param {string} id 
     * @returns Response which can return any error or user on success
     */
    static async get(id) {
        let response = {
            user: {},
            error: ''
        }

        // validation for given id
        if (id === null || id === undefined) {
            response.error = 'pls provide an id'
            return response
        }

        // check if parent exists on userData
        let userData = await Redis.get('data')
        if (userData === null) {
            userData = {}
        }
        else {
            userData = JSON.parse(userData)
        }

        // checking duplicate user id
        if (userData[id] === undefined) {
            response.error = `user with this id doesn't exists`
            return response
        }

        response.user = { id, data: userData[id] }
        return response
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