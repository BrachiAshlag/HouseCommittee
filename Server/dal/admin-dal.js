const db = require('../models/index')
const Admin = db.admins;

const createAdmin = async (AdminToAdd) => {  
    return await Admin.create(AdminToAdd);
}

const deleteAdmin = async (id) => {
    return await Admin.destroy({
      where: { id: id }
    })
}

const getAllAdmins = async () => {
    return await Admin.findAll({});
}

const getAdminById = async (id) => {
    return await Admin.findByPk(id);
}

const getAdminByPassword = async (password) => {
    return await Admin.findOne({ where: {password: password}});
}

module.exports = {
    createAdmin,
    deleteAdmin,
    getAllAdmins,
    getAdminById,
    getAdminByPassword
}