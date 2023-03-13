const faults_dal = require("../dal/faults-dal");

const createFault = (req, res) => {  
    faults_dal.createFault(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Faults."
          });
    });
}

const deleteFault = (req, res) => {
    faults_dal.deleteFault(req.params.id)
    .then(num => {
        if (num == 1) {
            console.log(num);
            res.send({
                message: "Faults was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete Faults with id=${req.params.id}. Maybe Faults was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Faults with id=" + req.params.id
        });
    });
}

const getAllFaults = (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    faults_dal.getAllFaults(req.query.building_id)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Faults."
            });
        });
}

module.exports = {
    createFault,
    deleteFault,
    getAllFaults
}
