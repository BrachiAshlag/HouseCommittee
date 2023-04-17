const monthes = require("../dal/monthes-dal");

const createMonth = (req, res) => {  
    monthes.createMonth(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Months."
          });
    });
}

const deleteMonth = (req, res) => {
    monthes.deleteMonth(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Monthes was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete Monthes with id=${req.params.id}. Maybe Monthes was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Monthes with id=" + req.params.id
        });
    });
}

const getAllMonthes = (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    monthes.getAllMonthes(req.query.building_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Monthes."
            });
        });
}

module.exports = {
    createMonth,
    deleteMonth,
    getAllMonthes
}
