const db = require('../models/index')
const Expense = db.expenses;
const { Op } = require('sequelize');


const createExpense = async (expenseToAdd) => {  
    return await Expense.create(expenseToAdd);
}

const deleteExpense = async (id) => {
    return await Expense.destroy({
      where: { id: id }
    });
}

const updateExpense = async (id, expenseToUpdate) => {
    return await Expense.update(expenseToUpdate, {
        where: { id: id }
    });
}

const getExpense = async (id) => {
    return await Expense.findByPk(id);  
}

const getExpensesInRange = async(building_id, date1, date2) => {
    return await Expense.findAll({        
        include:[
            {model: db.expenses_kinds, attributes: ['description']},
            {model: db.payment_forms, attributes: ['description']}
        ],       
        where:{
            [Op.and]: {
                expenses_date:{
                    [Op.gte]: date1,
                    [Op.lte]: date2
                },
                building_id:building_id
            }
        }
    })
}

module.exports = {
    createExpense,
    deleteExpense,
    updateExpense,
    getExpense,
    getExpensesInRange
}