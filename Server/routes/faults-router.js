const express = require("express");
const faults = require("../controllers/faults-controller");

const faultsRouter = express.Router();

faultsRouter.route("/")
    .get(faults.getAllFaults)
    .post(faults.createFault);

faultsRouter.route("/:id")
    .delete(faults.deleteFault);

module.exports = faultsRouter;
 