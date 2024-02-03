const Regex = require("../../utils/Regex");

const putRouteBodySchema = {
    id: {
        toMatch: Regex.id,
        required: true
    },
    data:{
        username: {
            toMatch: Regex.username,
            required: true
        },
        // password: {
        //     toMatch: Regex.password,
        //     required: true
        // },
        nationalID: {
            toMatch: Regex.nationalID,
            required: true
        },
        jobSkill:{
            toMatch: Regex.jobSkill,
        },
        jobTitle:{
            toMatch: Regex.jobTitle,
        },
        name:{
            toMatch: Regex.name,
            // required: true
        },
        family:{
            toMatch: Regex.family,
            // required: true
        },
        gender:{
            toMatch: Regex.gender,
        },
        education:{
            toMatch: Regex.education,
        },
        email:{
            toMatch: Regex.email,
            // required: true
        },
        phone:{
            toMatch: Regex.phone,
            // required: true
        },

    },
    parentID:{
        toMatch: Regex.id,
        required: true
    }
}

module.exports = putRouteBodySchema