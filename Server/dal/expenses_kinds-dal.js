const db = require('../models/index')
const Expense_kind = db.expenses_kinds;

const createExpenses_kind = async (expense_kindToAdd) => {  
    return await Expense_kind.create(expense_kindToAdd);
}

const deleteExpense_kind = async (id) => {
    return await Expense_kind.destroy({
      where: { id: id }
    })
}

const getAllExpenses_kinds = async (building_id) => {
    return await Expense_kind.findAll({ where: { building_id: building_id } });
}
module.exports = {
    createExpenses_kind,
    deleteExpense_kind,
    getAllExpenses_kinds
}