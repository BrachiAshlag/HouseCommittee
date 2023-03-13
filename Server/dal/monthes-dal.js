const db = require('../models/index')
const Monthes = db.monthes;

const createMonth = async (monthToAdd) => {  
    return await Monthes.create(monthToAdd);
}

const deleteMonth = async (id) => {
    return await Monthes.destroy({
      where: { id: id }
    })
}

const getAllMonthes = async (building_id) => {
    return await Monthes.findAll({ where: { building_id: building_id } });
}
module.exports = {
    createMonth,
    deleteMonth,
    getAllMonthes
}