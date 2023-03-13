const db = require('../models/index')
const Parks = db.parks;

const createPark = async (parkToAdd) => {  
    return await Parks.create(parkToAdd);
}

const deletePark = async (id) => {
    return await Parks.destroy({
      where: { id: id }
    })
}

const getAllParks = async () => {
    return await Parks.findAll({});
}

const getParkById = async (id) => {
    return await Parks.findByPk(id);
}

module.exports = {
    createPark,
    deletePark,
    getAllParks,
    getParkById
}