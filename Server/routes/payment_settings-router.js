
const express = require("express");
const payments_settings = require("../controllers/payment_settings-controller");

const payments_settingsRouter = express.Router();

payments_settingsRouter.route("/")
    .get(payments_settings.getPayment_settingsById)
    .post(payments_settings.createPayment_settings)
    .put(payments_settings.updatePayment_settings);      

payments_settingsRouter.route("/Last")
    .get(payments_settings.getLastPayment_settings)

module.exports = payments_settingsRouter;

 