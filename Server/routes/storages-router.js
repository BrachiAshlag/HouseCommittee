const express = require("express");
const storages = require("../controllers/storage-controller");

const storagesRouter = express.Router();

storagesRouter.route("/")
    .get(storages.getAllStorages)
    .post(storages.createStorage);

storagesRouter.route("/:id")
    .get(storages.getStorageById)
    .delete(storages.deleteStorage);

storagesRouter.route("/byApartment/:id")
    .get(storages.getStoragesByApartment);
    
module.exports = storagesRouter;

