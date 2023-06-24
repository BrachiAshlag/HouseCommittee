const db = require('../models')
const Building = db.buildings;
const { QueryTypes } = require('sequelize');

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

const getLastBuildings = () => {
    return Building.sequelize.query("SELECT LAST_INSERT_ID();", { type: QueryTypes.SELECT });
}

module.exports = {
    createBuilding,
    deleteBuilding,
    updateBuilding,
    getBuildingById,
    getAllBuildings,
    getLastBuildings
}