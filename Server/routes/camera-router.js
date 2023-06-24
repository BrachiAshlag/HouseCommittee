const express = require("express");
const cameras = require("../controllers/cameras-controller");

const camerasRouter = express.Router();

camerasRouter.route("/")
    .get(cameras.getAllCameras)
    .post(cameras.createCamera);

camerasRouter.route("/:id")
    .delete(cameras.deleteCamera);

module.exports = camerasRouter;