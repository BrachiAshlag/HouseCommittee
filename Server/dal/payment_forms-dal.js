const db = require('../models/index')
const Payment_forms = db.payment_forms;

const createPayment_form = async (Payment_formToAdd) => {  
    return await Payment_forms.create(Payment_formToAdd);
}

const deletePayment_form = async (id) => {
    return await Payment_forms.destroy({
      where: { id: id }
    })
}

const getAllPayment_forms = async (building_id) => {
    return await Payment_forms.findAll({ where: { building_id: building_id } });
}
module.exports = {
    createPayment_form,
    deletePayment_form,
    getAllPayment_forms
}