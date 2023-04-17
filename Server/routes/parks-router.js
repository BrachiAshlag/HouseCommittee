const express = require("express");
const parks = require("../controllers/parks-controller");

const parksRouter = express.Router();

parksRouter.route("/")
    .get(parks.getAllParks)
    .post(parks.createPark);

parksRouter.route("/:id")
    .delete(parks.deletePark);

module.exports = parksRouter;
 