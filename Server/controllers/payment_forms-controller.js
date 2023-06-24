const payment_forms = require("../dal/payment_forms-dal");

const createPayment_form = (req, res) => {  
    payment_forms.createPayment_form(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the payment_forms."
          });
    });
}

const deletePayment_form = (req, res) => {
    payment_forms.deletePayment_form(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Payment_forms was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete Payment_form with id=${req.params.id}. Maybe Payment_form was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete payment_form with id=" + req.params.id
        });
    });
}

const getAllPayment_forms = (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
        payment_forms.getAllPayment_forms(req.query.building_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Payment_forms."
            });
        });
}

module.exports = {
    createPayment_form,
    deletePayment_form,
    getAllPayment_forms
}
