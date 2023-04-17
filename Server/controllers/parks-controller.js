const parks_dal = require("../dal/parks-dal.js");
const Apartment_dal = require("../dal/apartments-dal");
const Entry_dal = require("../dal/entry-dal");
const Building_dal = require("../dal/building-dal");

const createPark = (req, res) => {  
    parks_dal.createPark(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Parks."
          });
    });
}

const deletePark = (req, res) => {
    parks_dal.deletePark(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Parks was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete Parks with id=${req.params.id}. Maybe Parks was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Parks with id=" + req.params.id
        });
    });
}

const getAllParks = async (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try{
        const parks = await parks_dal.getAllParks();
        if(parks){
            for (let i = 0; i < parks.length; i++) {
                const element = parks[i];
                const apartment = await Apartment_dal.getApartment(element.apartment_id);
                if(apartment){
                    const entry = await Entry_dal.getEntryById(apartment.entry_id);
                    if(entry){
                        const building = await Building_dal.getBuildingById(entry.building_id);
                        if(building){
                            if (building.id == req.query.building_id)
                                response.push(element.dataValues);
                        }
                        else
                        res.status(404).send({
                            message: `Cannot find parks in building ${req.query.building_id}.`
                        });
                    }
                    else
                    res.status(404).send({
                        message: `Cannot find parks in building ${req.query.building_id}.`

                    });
                }
                else
                res.status(404).send({
                    message: `Cannot find parks in building ${req.query.building_id}.`
                });   
            }
            res.send(response);
        }
        else
        res.status(404).send({
            message: `Cannot find parks in building ${req.query.building_id}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving parks."
        });
    }   
}

const getParkById = async(req, res) =>{
    try{
        const park = await parks_dal.getParkById(req.params.id);
        if(park){
            res.send(park);
        }
        else
        res.status(404).send({
            message: `Cannot find park with id=${req.params.id}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving parking."
        });
    }   
}

module.exports = {
    createPark,
    deletePark,
    getAllParks,
    getParkById
}
