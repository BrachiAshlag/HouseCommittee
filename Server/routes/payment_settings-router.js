
const express = require("express");
const payments_settings = require("../controllers/payment_settings-controller");

const payments_settingsRouter = express.Router();

payments_settingsRouter.route("/")
    .get(payments_settings.getPayment_settings)
    .post(payments_settings.createPayment_settings);
    

payments_settingsRouter.route("/:id")
    .put(payments_settings.updatePayment_settings);

module.exports = payments_settingsRouter;

 