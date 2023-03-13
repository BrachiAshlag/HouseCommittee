const express = require("express");
const expenses_kinds = require("../controllers/expenses_kinds-controller");

const expenseKindsRouter = express.Router();

expenseKindsRouter.route("/")
    .get(expenses_kinds.getAllExpenses_kinds)
    .post(expenses_kinds.createExpenses_kind);

expenseKindsRouter.route("/:id")
    .delete(expenses_kinds.deleteExpense_kind);

module.exports = expenseKindsRouter;
 