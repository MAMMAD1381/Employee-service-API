const {Redis} = require('../utils/Redis')

/**
 * @class - represents user object in app
 */
class User{
    /**
     * this function creates a user with given Data
     * @param {object} Data - Data object which includes: id, data, parent
     * @returns Response which can return any error or user on success
     */
    static async create(Data){
        const {id, data, parent} = Data
        let response={
            user:{},
            error:''
        }

        // validation for given data
        if(id === null || id === undefined){
            response.error = 'pls provide an id'
            return response
        }
        if(data === null || data === undefined){
            response.error = 'pls provide data'
            return response
        }
        if(parent === null || parent === undefined){
            response.error = 'pls provide a parent id'
            return response
        }

        // check if parent exists on userData
        let userData  = await Redis.get('data')
        if(userData === null){
            userData = {}
        }
        else {
            userData = JSON.parse(userData)
        }
        if(userData[parent] === undefined){
            response.error = `parent id doesn't exists`
            return response
        }
            
        // checking duplicate user id
        if(userData[id] !== undefined){
            response.error = `user with this id already exists`
            return response
        }

        // get parents from redis
        let parents = await Redis.get('parents')
        if(parents === null){
            parents = {}
        }
        else{
            parents = JSON.parse(parents)
        }

        if(parents[parent] === undefined){
            parents[parent] = []
        }

        // push the changes to redis
        parents[parent].push(id)
        await Redis.set('parents', JSON.stringify(parents))
        userData[id] = data
        await Redis.set('data', JSON.stringify(userData))

        response.user = {id, data}
        return response
    }

    /**
     * this function updates the user with given data, like changing parent or data
     * @param {string} id - given data in url
     * @param {object} Data - given Data in body which includes: data, parent
     * @returns Response which can return any error or user on success
     */
    static async update(id, Data){
        const {data, parent} = Data
        let response={
            user:{},
            error:''
        }

        // validation for given id and Data
        if(id === null || id === undefined){
            response.error = 'pls provide an id'
            return response
        }
        if(data === null || data === undefined){
            response.error = 'pls provide data'
            return response
        }
        if(parent === null || parent === undefined){
            response.error = 'pls provide a parent id'
            return response
        }

        // check if parent exists on userData
        let userData = await Redis.get('data')
        if(userData === null){
            userData = {}
        }
        else {
            userData = JSON.parse(userData)
        }
        // checking duplicate user id
        if(userData[id] === undefined){
            response.error = `user with this id doesn't exists`
            return response
        }

        // update userData on redis
        userData[id] = data
        await Redis.set('data', JSON.stringify(userData))

        let parents = await Redis.get('parents')
        if(parents === null){
            parents = {}
        }
        else{
            parents = JSON.parse(parents)
        }
        if(parents[parent] === undefined){
            response.error = `given parent id doesn't exists`
            return response
        }

        for(let p in parents){
            parents[p].filter(element => parseInt(element) !== parseInt(id));
            let temp = []
            for(let i=0; i<parents[p].length; i++){
                if(parseInt(parents[p][i]) !== parseInt(id)){
                    temp.push(parents[p][i])
                }
            }
            parents[p] = temp
        }

        parents[parent].push(id)
        
        await Redis.set('parents', JSON.stringify(parents))
        response.user = {id, data:userData[id]}
        return response
    }

    /**
     * returns the certain user based on given id
     * @param {string} id 
     * @returns Response which can return any error or user on success
     */
    static async get(id){
        let response={
            user:{},
            error:''
        }

        // validation for given id
        if(id === null || id === undefined){
            response.error = 'pls provide an id'
            return response
        }

        // check if parent exists on userData
        let userData  = await Redis.get('data')
        if(userData === null){
            userData = {}
        }
        else {
            userData = JSON.parse(userData)
        }

        // checking duplicate user id
        if(userData[id] === undefined){
            response.error = `user with this id doesn't exists`
            return response
        }

        response.user = {id, data:userData[id]}
        return response
    }
}
module.exports = {User}