const { Op } = require('sequelize');
const db = require('../models')
const Tenant = db.tenants;

const createTenant = async (tenantToAdd) => {
    const ten = await getTenantById(tenantToAdd.id);
    if (ten != undefined) throw new Error("The tenant is already exist");
    return await Tenant.create(tenantToAdd);
}

const getByPassword = async (password) => {
    return await Tenant.findAll({ where: { password: password } });
}

const deleteTenant = async (id) => {
    return await Tenant.destroy({
        where: { id: id }
    });
}

const updateTenant = async (id, tenantToUpdate) => {
    return await Tenant.update(tenantToUpdate, {
        where: { id: id }
    });
}

const getTenantByApartmentId = async (apartment_id) => {
    return await Tenant.findAll({ where: { apartment_id: apartment_id } });
}

const getTenantById = async (id) => {
    return await Tenant.findByPk(id);
}
const getTenantByName = async (name) => {
    return await Tenant.findAll({ where: { [Op.and]: [{ name: name }] } })
}

const getTenantByPhone = async (phone) => {
    return await Tenant.findAll({ where: { phone: phone } })
}

const getTenantByCarNum = async (carNum) => {
    return await Tenant.findAll({ where: { car_id: carNum } })
}

const getAllTenants = async () => {
    return await Tenant.findAll({});
}

module.exports = {
    createTenant,
    deleteTenant,
    updateTenant,
    getByPassword,
    getTenantById,
    getAllTenants,
    getTenantByName,
    getTenantByCarNum,
    getTenantByApartmentId,
    getTenantByPhone
}