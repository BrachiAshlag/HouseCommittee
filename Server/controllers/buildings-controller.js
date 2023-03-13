const Building_dal = require("../dal/building-dal");

const createBuilding = (req, res) => {
    Building_dal.createBuilding(req.body)
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

const deleteBuilding = (req, res) => {
    const id = req.params.id;
    Building_dal.deleteBuilding(id)
    .then(num => {
        if (num == 1) 
            res.send({
                message: "building was deleted successfully!"
            });
        else 
        res.send({
            message: `Cannot delete building with id=${id}. Maybe building was not found!`
        });
    })
    .catch(err => {
        res.status(500).send({
        message: "Could not delete building with id=" + id
        });
    });
}

const updateBuilding = (req, res) => {
    const id=req.params.id;
    Building_dal.updateBuilding(id ,req.body)
    .then(num => {
        if (num == 1) {
          res.send({
            message: "building was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update building with id=${id}. Maybe building was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating building with id=" + id
        });
      });
}

const getBuilding = (req, res) => {
    const id =req.params.id;
    Building_dal.getBuildingById(id)
    .then(data=>{
        if (data) 
            res.send(data);
        else
            res.status(404).send({
                message: `Cannot models id=${id}.`
            });  
    })
    .catch (err=>{
        res.status(500).send({
            message: "Error retrieving Building with id=" + id
        });
    });
}

const getAllBuildings = (req, res) => {
    Building_dal.getAllBuildings()
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
}

module.exports = {
    createBuilding,
    deleteBuilding,
    updateBuilding,
    getBuilding,
    getAllBuildings
}