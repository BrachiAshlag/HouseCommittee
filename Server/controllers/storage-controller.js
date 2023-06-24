const storages_dal = require("../dal/storage-dal");
const Apartment_dal = require("../dal/apartments-dal");
const Entry_dal = require("../dal/entry-dal");
const Building_dal = require("../dal/building-dal");

const createStorage = (req, res) => {  
    storages_dal.createStorage(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Storages."
          });
    });
}

const deleteStorage = (req, res) => {
    storages_dal.deleteStorage(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Storages was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete Storages with id=${req.params.id}. Maybe Storages was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Storages with id=" + req.params.id
        });
    });
}

const getAllStorages = async (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try{
        const storages = await storages_dal.getAllStorages();
        if(storages){
            for (let i = 0; i < storages.length; i++) {
                const element = storages[i];
                const apartment = await Apartment_dal.getApartment(element.apartment_id);
                if(apartment){
                    const entry = await Entry_dal.getEntryById(apartment.entry_id); 
                    if(entry){
                        const building = await Building_dal.getBuildingById(entry.building_id); 
                        if(building){
                            if(building.id == req.query.building_id)
                                response.push(element);
                        }
                        else
                            res.status(404).send({
                                message: `Cannot find apartment with id=${id}.`
                            });
                    }
                    else
                        res.status(404).send({
                            message: `Cannot find apartment with id=${id}.`
                        });   
                }
                else 
                    res.status(404).send({
                        message: `Cannot find apartment with id=${id}.`
                    });
            }
            res.send(response);
        }
        else
        res.status(404).send({
            message: `Cannot find apartment with id=${id}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Storages."
        });
    }   
}

const getStoragesByApartment = async (req, res) => {
    var response = [];
    try{
        const storages = await storages_dal.getAllStorages();
        if(storages){
            for (let i = 0; i < storages.length; i++) {
                const element = storages[i];
                if(element.dataValues.apartment_id==req.params.id)
                    response.push(element.dataValues)
            }
            res.send(response);
        }
        else
        res.status(404).send({
            message: `Cannot find storages with apartment_id=${id}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Storages."
        });
    }   
}

const getStorageById = async(req, res) =>{
    try{
        const storage = await storages_dal.getStorageById(req.params.id);
        if(storage){
            res.send(storage);
        }
        else
        res.status(404).send({
            message: `Cannot find storage with id=${req.params.id}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Storages."
        });
    }   
}

module.exports = {
    createStorage,
    deleteStorage,
    getAllStorages,
    getStorageById,
    getStoragesByApartment
}

