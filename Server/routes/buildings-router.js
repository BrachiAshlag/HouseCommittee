
const express = require("express");
const buildings = require("../controllers/buildings-controller");

const BuildingRouter = express.Router();

BuildingRouter.route("/")
    .get(buildings.getAllBuildings)
    .post(buildings.createBuilding);
  
BuildingRouter.route("/last")
    .get(buildings.getLastBuildings)
 
BuildingRouter.route("/:id")
    .get(buildings.getBuilding)
    .delete(buildings.deleteBuilding)
    .put(buildings.updateBuilding);

module.exports = BuildingRouter;