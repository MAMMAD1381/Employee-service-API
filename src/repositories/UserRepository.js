const RedisModel = require('../models/RedisModel');

class UserRepository {

    static async createUser(id, data, parentID){
        const newUser = await RedisModel.addUser(id, data)

        await RedisModel.addParent(id, parentID)

        return newUser
    }

    static async updateUser(id, data, parentID){
        const updatedUser =  await RedisModel.updateUser(id, data)

        await RedisModel.updateParent(id, parentID)
        
        return updatedUser
    }

    static async getUser(id){
        const user = await RedisModel.getUser(id)
        
        return user
    }

    static async getParent(id){
        const parent = await RedisModel.getParent(id)        
        return parent
    }

    static async getUsers(managerID){
        const parents = await RedisModel.getParents(managerID)  
        const managerUsers = []
        for(let key in parents){

            if(parents[key] === managerID)
                managerUsers.push(await RedisModel.getUser(key.split(':')[1]))
        }    
        return managerUsers
    }

    static async deleteUser(id){
        return await RedisModel.deleteUser(id)
    }

    static async deleteParent(id){
        return await RedisModel.deleteParent(id)
    }

    static async isDatabasesEmpty(){
        return (await RedisModel.isDatabaseEmpty(0) && await RedisModel.isDatabaseEmpty(1))
    }
}

module.exports = UserRepository;
