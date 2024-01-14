const bodyParser = require("./Parsers/bodyParser")
const paramParser = require("./Parsers/paramParser")
const bodyValidation = require("./Validations/bodyValidation")
const paramValidation = require("./Validations/paramValidation")


const middlewares = {
    parsers:{
        body: bodyParser,
        param: paramParser
    },
    validations:{
        body: bodyValidation,
        param: paramValidation
    }
}

module.exports = middlewares