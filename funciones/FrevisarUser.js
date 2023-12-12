const FresUser = require('./resUser.js');

const FrevisarUser = (variables,user) => {
    const resUser = FresUser
    let res = resUser(variables,user, false, true)
    return res
}
module.exports = FrevisarUser