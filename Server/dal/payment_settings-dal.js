const db = require('../models/index')
const Payment_settings = db.payments_settings;
const { QueryTypes } = require('sequelize');

const createPayment_settings = async (payment_settingsToAdd) => { 
    return await Payment_settings.create(payment_settingsToAdd);
}

const getPayment_settings = async (building_id) => {
    return await Payment_settings.findOne({
        where:{building_id: building_id}
    });
}

const getLastPaymentSettings = () => {
    return Payment_settings.sequelize.query("SELECT LAST_INSERT_ID();", { type: QueryTypes.SELECT });
}

const getPaymentSettingsById = async (id) => {
    return await Payment_settings.findByPk(id);
}

const getAllPayment_settings = async () => {
    return await Payment_settings.findAll({});
}

const updatePayment_settings = async (id, objectToUpdate) => {
    return await Payment_settings.update(objectToUpdate, {
        where: { id: id }
    });
}
module.exports = {
    createPayment_settings,
    getPayment_settings,
    getLastPaymentSettings,
    getAllPayment_settings,
    updatePayment_settings,
    getPaymentSettingsById
}