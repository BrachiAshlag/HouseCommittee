const express = require("express");
const parkingPremits = require("../controllers/parking_premits-controller");

const parkingPremitRouter = express.Router();

parkingPremitRouter.route("/")
    .get(parkingPremits.getAllParking_premits)
    .post(parkingPremits.createParking_premit);  
       
parkingPremitRouter.route("/:id")
    .get(parkingPremits.getParking_premit)
    .delete(parkingPremits.deleteParking_premit)
    .put(parkingPremits.updateParking_premit);

module.exports = parkingPremitRouter;