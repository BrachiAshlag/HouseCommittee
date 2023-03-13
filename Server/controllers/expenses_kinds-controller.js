const expenses_kinds_dal = require("../dal/expenses_kinds-dal");

const createExpenses_kind = (req, res) => {  
    expenses_kinds_dal.createExpenses_kind(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the expenses_kind."
          });
    });
}

const deleteExpense_kind = (req, res) => {
    expenses_kinds_dal.deleteExpense_kind(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Expenses_kinds was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete Expenses_kind with id=${req.params.id}. Maybe Expenses_kind was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Expenses_kind with id=" + req.params.id
        });
    });

}

const getAllExpenses_kinds = (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    expenses_kinds_dal.getAllExpenses_kinds(req.query.building_id)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Expenses_kinds."
            });
        });
}

module.exports = {
    createExpenses_kind,
    deleteExpense_kind,
    getAllExpenses_kinds
}
