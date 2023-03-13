const db = require('../models')
const Building = db.buildings;

const createBuilding = async (buildingToAdd) => {
    return Building.create(buildingToAdd);
}

const deleteBuilding = (id) => {
    return Building.destroy({
        where: { id: id }
      })
}

const updateBuilding = (id, buildingToUpdate) => {
    return Building.update(buildingToUpdate, {
        where: { id: id }
      })
}

const getBuildingById = (id) => {
    return Building.findByPk(id);
}


const getAllBuildings = () => {
    return Building.findAll({});
}

module.exports = {
    createBuilding,
    deleteBuilding,
    updateBuilding,
    getBuildingById,
    getAllBuildings
}