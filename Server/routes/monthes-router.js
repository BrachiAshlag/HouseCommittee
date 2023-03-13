const express = require("express");
const monthes = require("../controllers/monthes-controller");

const monthesRouter = express.Router();

monthesRouter.route("/")
    .get(monthes.getAllMonthes)
    .post(monthes.createMonth);

monthesRouter.route("/:id")
    .delete(monthes.deleteMonth);

module.exports = monthesRouter;
