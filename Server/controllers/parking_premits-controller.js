const Parking_premit_dal = require("../dal/parking_premit-dal");
const Tenant_dal = require("../dal/tenants-dal");
const Apartment_dal = require("../dal/apartments-dal");
const Entry_dal = require("../dal/entry-dal");
const Building_dal = require("../dal/building-dal");

const createParking_premit = (req, res) => {
    Parking_premit_dal.createParking_premit(req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Parking_premit."
            });
        });
}

const deleteParking_premit = (req, res) => {
    Parking_premit_dal.deleteParking_premit(req.params.id)
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Parking_premit was deleted successfully!"
                });
            }
            else {
                res.status(404).send({
                    message: `Cannot delete Parking_premit with id=${req.params.id}. Maybe Parking_premit was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Parking_premit with id=" + req.params.id
            });
        });
}

const updateParking_premit = (req, res) => {
    const id = req.params.id;
    Parking_premit_dal.updateParking_premit(id, req.body)
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "parking permit was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update parking permit with id=${id}. Maybe expense was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating parking permit with id=" + id
            });
        });
}

const getParking_premit = async (req, res) => {
    Parking_premit_dal.getParking_premit(req.params.id)
        .then(data => {
            if (data)
                res.send(data);
            else {
                res.status(404).send({
                    message: `Cannot find Parking_premit with id=${req.params.id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Parking_premit with id=" + req.params.id
            });
        })
}

const getAllParking_premits = async (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try {
        const permits = await Parking_premit_dal.getAllParking_premits();
        if(permits){
            for (let i = 0; i < permits.length; i++) {
                const element = permits[i];
                const tenant = await Tenant_dal.getTenantById(element.tenant_id);
                if(tenant){
                    const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
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
                                message: `Cannot find parking premit in building ${req.query.building_id}.`
                            });
                        }
                        else
                        res.status(404).send({
                            message: `Cannot find parking premit in building ${req.query.building_id}.`
                        });
                    }
                    else
                    res.status(404).send({
                        message: `Cannot find parking premit in building ${req.query.building_id}.`
                    });
                }
                else
                res.status(404).send({
                    message: `Cannot find parking premit in building ${req.query.building_id}..`
                });
            }
            res.send(response);
        }
        else
        res.status(404).send({
            message: `Cannot find parking premit in building ${req.query.building_id}.`
        });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Parking_premits."
        });
    };
}

module.exports = {
    createParking_premit,
    deleteParking_premit,
    updateParking_premit,
    getParking_premit,
    getAllParking_premits
}