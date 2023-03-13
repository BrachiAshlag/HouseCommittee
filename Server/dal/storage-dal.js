const db = require('../models/index')
const Storage = db.storages;

const createStorage = async (storageToAdd) => {  
    return await Storage.create(storageToAdd);
}

const deleteStorage = async (id) => {
    return await Storage.destroy({
      where: { id: id }
    })
}

const getAllStorages = async () => {
    return await Storage.findAll({});
}

const getStorageById = async (id) => {
    return await Storage.findByPk(id);
}

module.exports = {
    createStorage,
    deleteStorage,
    getAllStorages,
    getStorageById
}