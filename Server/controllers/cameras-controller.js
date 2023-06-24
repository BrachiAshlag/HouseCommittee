const cameras = require("../dal/camera-dal");

const createCamera = (req, res) => {  
    cameras.createCamera(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Cameras."
          });
    });
}

const deleteCamera = (req, res) => {
    cameras.deleteCamera(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Camera was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete Camera with id=${req.params.id}. Maybe Camera was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Cameraes with id=" + req.params.id
        });
    });
}

const getAllCameras = (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    cameras.getAllCameras(req.query.building_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Cameras."
            });
        });
}

module.exports = {
    createCamera,
    deleteCamera,
    getAllCameras
}
