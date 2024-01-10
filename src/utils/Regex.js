const Regex = {
    id: /^\d{5}$/,
    username: /^[a-zA-Z0-9_-]{3,16}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    nationalID: /^[a-zA-Z0-9]{6,}$/,
    jobSkill: /^.{0,50}$/,
    jobTitle: /^.{0,20}$/,
    name: /^.{0,20}$/,
    family: /^.{0,20}$/,
    gender: /male|female/,
    education: /^.{0,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[\d\s.-]+$/
}

module.exports = Regex