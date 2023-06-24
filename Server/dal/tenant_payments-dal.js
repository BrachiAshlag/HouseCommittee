const db = require('../models/index')
const Tenants_payments = db.tenant_payments;
const { Op } = require('sequelize');

const createTenant_payment = async (tenantPaymentToAdd) => {
    return await Tenants_payments.create(tenantPaymentToAdd);
}

const deleteTenant_payment = async (id) => {
    return await Tenants_payments.destroy({
        where: { id: id }
    });
}

const updateTenant_payment = async (id, tenantPaymentToUpdate) => {
    return await Tenants_payments.update(tenantPaymentToUpdate, {
        where: { id: id }
    });
}

const getTenant_payment = async (id) => {
    return await Tenants_payments.findByPk(id);
}

const getAllTenants_payments = async (apartment_id) => {
    return await Tenants_payments.findAll({ where: { apartment_id: apartment_id } });
}

const getTenants_paymentsInRange = async (date1, date2) => {
    return await Tenants_payments.findAll({
        include: [
            { model: db.payment_forms, attributes: ['description'] }
        ],
        where: {
            payments_date: {
                [Op.gt]: date1,
                [Op.lt]: date2
            }
        }
    })
}

const getTenants_paymentsInRangeByApartment = async (apartmentId, date1, date2) => {
    return await Tenants_payments.findAll({
        include: [
            { model: db.payment_forms, attributes: ['description'] }
        ],
        where:
        {
            [Op.and]: {
                payments_date: {
                    [Op.gt]: date1,
                    [Op.lt]: date2
                },
                apartment_id: apartmentId
            }
        }
    })
}





module.exports = {
    createTenant_payment,
    deleteTenant_payment,
    updateTenant_payment,
    getTenant_payment,
    getAllTenants_payments,
    getTenants_paymentsInRange,
    getTenants_paymentsInRangeByApartment
}