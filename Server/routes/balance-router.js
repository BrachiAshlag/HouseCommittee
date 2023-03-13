const express = require("express");
const balance = require("../controllers/balance-controller.js");
const balanceRouter = express.Router();

balanceRouter.route("/")
    .get(balance.getBalance)

    
module.exports = balanceRouter;