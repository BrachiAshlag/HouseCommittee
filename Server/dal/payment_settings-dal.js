const db = require('../models/index')
const Payment_settings = db.payments_settings;

const createPayment_settings = async (payment_settingsToAdd) => { 
    return await Payment_settings.create(payment_settingsToAdd);
}

const getPayment_settings = async (building_id) => {
    return await Payment_settings.findOne({
        where:{building_id: building_id}
    });
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
    getAllPayment_settings,
    updatePayment_settings
}