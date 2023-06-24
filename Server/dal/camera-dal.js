const db = require('../models/index')
const Cameras = db.cameras;

const createCamera = async (cameraToAdd) => {  
    return await Cameras.create(cameraToAdd);
}

const deleteCamera = async (id) => {
    return await Cameras.destroy({
      where: { id: id }
    })
}

const getAllCameras = async (building_id) => {
    return await Cameras.findAll({ where: { building_id: building_id } });
}
module.exports = {
    createCamera,
    deleteCamera,
    getAllCameras
}