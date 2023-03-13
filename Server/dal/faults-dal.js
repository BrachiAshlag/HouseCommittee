const db = require('../models/index')
const Faults = db.faults;

const createFault = async (faultToAdd) => {  
    return await Faults.create(faultToAdd);
}

const deleteFault = async (id) => {
    return await Faults.destroy({
      where: { id: id }
    })
}

const getAllFaults = async (building_id) => {
    return await Faults.findAll({ where: { building_id: building_id } });
}
module.exports = {
    createFault,
    deleteFault,
    getAllFaults
}