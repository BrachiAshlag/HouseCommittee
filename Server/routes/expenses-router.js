const express = require("express");
const expenses = require("../controllers/expenses-controller");

const expenseRouter = express.Router();

expenseRouter.route("/")
    .get(expenses.getAllExpenses)
    .post(expenses.createExpense);
    
expenseRouter.route("/:id")
    .get(expenses.getExpense)
    .delete(expenses.deleteExpense)
    .put(expenses.updateExpense);

module.exports = expenseRouter;