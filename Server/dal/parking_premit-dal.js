const db = require('../models/index')
const Parking_premit = db.parking_premits;


const createParking_premit = async (parking_premit) => {
    return await Parking_premit.create(parking_premit);
}

const deleteParking_premit = async (id) => {
    return await Parking_premit.destroy({
        where: { id: id }
    })
}

const updateParking_premit = async (id, Parking_premitToUpdate) => {
    return await Parking_premit.update(Parking_premitToUpdate, {
        where: { id: id }
    })
}

const getParking_premit = async (id) => {
    return await Parking_premit.findByPk(id);
}

const getAllParking_premits = async () => {
    return await Parking_premit.findAll({});
}

const getParkingByTenantId = async (tenantId) => {
    return await Parking_premit.findOne({ where: { tenant_id : tenantId } }) 
}

module.exports = {
    createParking_premit,
    deleteParking_premit,
    updateParking_premit,
    getParking_premit,
    getAllParking_premits,
    getParkingByTenantId
}