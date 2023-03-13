const expenses_dal = require('../dal/expense-dal')

const createExpense = (req, res) => { 
    expenses_dal.createExpense(req.body)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
}

const deleteExpense = (req, res) => {
    const id = req.params.id;
    expenses_dal.deleteExpense(id)
    .then(num => {
        if (num == 1) 
            res.send({
                message: "expense was deleted successfully!"
            });
        else 
        res.send({
            message: `Cannot delete expense with id=${id}. Maybe expense was not found!`
        });
    })
    .catch(err => {
        res.status(500).send({
        message: "Could not delete expense with id=" + id
        });
    });
}

const updateExpense = (req, res) => {
    const id=req.params.id;
    expenses_dal.updateExpense(id ,req.body)
    .then(num => {
        if (num == 1) {
          res.send({
            message: "expense was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update expense with id=${id}. Maybe expense was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating expense with id=" + id
        });
      });
}

const getExpense = (req, res) => {
    const id =req.params.id;
    expenses_dal.getExpense(id)
    .then(data=>{
        if (data) 
            res.send(data);
        else
            res.status(404).send({
                message: `Cannot find expense with id=${id}.`
            });  
    })
    .catch (err=>{
        res.status(500).send({
            message: "Error retrieving apartment with id=" + id
        });
    });
}

const getAllExpenses = async (req, res) => {
    if(!req.query.building_id|| !req.body.startDate|| !req.body.endDate)
        res.status(404).send("The fields building_id, startDate and endDate required!!");
    try{
        var response = []
        const data = await expenses_dal.getExpensesInRange(req.query.building_id, req.body.startDate, req.body.endDate);
        if(data){
            data.forEach(element => {
                const x = {
                    "date": element.dataValues["date_of_expenses"],
                    "details": element.dataValues["expenses_kind"].dataValues["description"],
                    "amount": element.dataValues["amount"],
                    "methods_of_payment": element.dataValues["payment_form"].dataValues["description"],
                    "num_of_payments": element.dataValues["num_of_payments"]
                }
                response.push(x)
            });
            res.send(response);
        }
        else
        res.status(404).send({
            message: `Cannot find expense between ${req.body.startDate} and ${req.body.endDate}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving expenses."
        });
    };
}

module.exports = {
    createExpense,
    deleteExpense,
    updateExpense,
    getExpense,
    getAllExpenses
}