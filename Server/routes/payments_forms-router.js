const express = require("express");
const payment_forms = require("../controllers/payment_forms-controller");

const payment_formsRouter = express.Router();

payment_formsRouter.route("/")
    .get(payment_forms.getAllPayment_forms)
    .post(payment_forms.createPayment_form);

payment_formsRouter.route("/:id")
    .delete(payment_forms.deletePayment_form);

module.exports = payment_formsRouter;
