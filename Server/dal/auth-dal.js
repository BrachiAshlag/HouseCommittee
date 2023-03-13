const db = require('../models/index')
const Tenants = db.tenants;


const register = async (name) => {
    return await Tenants.findOne({where:{name: name}})
}

module.exports = {
    register
}