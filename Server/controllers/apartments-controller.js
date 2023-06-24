const Apartment_dal = require("../dal/apartments-dal");
const Entry_dal = require("../dal/entry-dal");
const Building_dal = require("../dal/building-dal");
const Tenant_dal = require("../dal/tenants-dal");
const storage_dal = require("../dal/storage-dal");
const park_dal = require("../dal/parks-dal");
const paymentSetting_dal = require("../dal/payment_settings-dal");

const createApartment = async (req, res) => {
    req.body.debt = 0;   
    try{
        const entry = await Entry_dal.getEntryById(req.body.entry_id);
        if(entry){
            const building = await Building_dal.getBuildingById(entry.building_id);
            if(building){
                const pay = await paymentSetting_dal.getPaymentSettingsById(building.payment_setting_id);
                if(pay){
                    if(pay.same_price)
                        req.body.pay_per_month = pay.same_price;
                    else
                        switch (req.body.num_of_rooms) {
                            case 1:
                                req.body.pay_per_month = pay.one_room;
                                break;
                            case 2:
                                req.body.pay_per_month = pay.two_rooms;
                                break;
                            case 3:
                                req.body.pay_per_month = pay.three_rooms;
                                break;
                            case 4:
                                req.body.pay_per_month = pay.four_rooms;
                                break;
                            case 5:
                                req.body.pay_per_month = pay.five_rooms;
                                break;
                            case 6:
                                req.body.pay_per_month = pay.six_rooms;
                                break;
                            default:
                                req.body.pay_per_month = pay.six_rooms;
                                break;
                        }    
                    Apartment_dal.createApartment(req.body)
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message || "Some error occurred while creating the Tutorial." });
                    });
                }
                else
                res.status(404).send({
                    message: `Cannot find settings in building ${entry.building_id}.`
                });
            }
            else
            res.status(404).send({
                message: `Cannot find building in building ${entry.building_id}.`
            });
        }
        else
        res.status(404).send({
            message: `Cannot find entry in building ${req.body.entry_id}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving parks."
        });
    }      
}



const deleteApartment = (req, res) => {
    const id = req.params.id;
    Apartment_dal.deleteApartment(id)
        .then(num => {
            if (num == 1)
                res.send({ message: "apartment was deleted successfully!" });
            else
                res.send({ message: `Cannot delete apartment with id=${id}. Maybe apartment was not found!` });
        })
        .catch(err => {
            res.status(500).send({ message: "Could not delete apartment with id=" + id });
        });
}

const updateApartment = (req, res) => {
    const id = req.params.id;
    Apartment_dal.updateApartment(id, req.body)
        .then(num => {
            if (num == 1) {
                res.send({ message: "apartment was updated successfully." });
            }
            else
                res.send({ message: `Cannot update apartment with id=${id}. Maybe apartment was not found or req.body is empty!` });

        })
        .catch(err => {
            res.status(500).send({ message: "Error updating apartment with id=" + id });
        });
}

const getApartmentById = (req, res) => {
    const id = req.params.id;
    Apartment_dal.getApartment(id)
        .then(data => {
            if (data)
                res.send(data);
            else
                res.status(404).send({ message: `Cannot find apartment with id=${id}.` });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving apartment with id=" + id
            });
        });
}

const getAllApartments = async (req, res) => {
    const building_id = req.query.building_id;
    if (!building_id)
        res.status(404).send("The field building_id is require!!")
    var response = [];
    try {
        const apartment = await Apartment_dal.getAllApartments();
        if (apartment) {
            for (let i = 0; i < apartment.length; i++) {
                const element = apartment[i];
                const entry = await Entry_dal.getEntryById(element.entry_id);
                if (entry) {
                    const building = await Building_dal.getBuildingById(entry.building_id);
                    if (building) {
                        if (building.id == building_id)
                            response.push(element.dataValues);
                    }
                    else res.status(404).send({ message: `Cannot find a building with id=${entry.building_id}.` });
                }
                else res.status(404).send({ message: `Cannot find an  entry with id=${element.entry_id}.` });
            }
            res.send(response);
        }
        else res.status(404).send({ message: `Cannot find any apartment.` });
    }
    catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving apartments." });
    }

}

const getApartmentByTenantId = async (req, res) => {
    const id = req.params.id;
    try {
        const tenant = await Tenant_dal.getTenantById(id);
        if (tenant) {
            const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
            if (apartment)
                res.send(apartment);
            else res.status(404).send({ message: `Cannot find apartment with id=${tenant.apartment_id}.` });
        }
        else res.status(404).send({ message: `Cannot find tenant with id=${id}.` });
    }
    catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving apartment with id=" + id });
    }
}

const getApartmentByStorage = async (req, res) => {
    const storage_id = req.params.id;
    if (!storage_id)
        res.status(404).send("The storage_id is require!!")
    try {
        const storage = await storage_dal.getStorageById(storage_id);
        if (storage) {
            const apartment = await Apartment_dal.getApartment(storage.apartment_id);
            if (apartment) {
                res.send(apartment);
            }
            else res.status(404).send({ message: `Cannot find an apartment with storage id= ${storage_id}.` });
        }
        else res.status(404).send({ message: `Cannot find a storage with id= ${storage_id}.` });
    }
    catch (err) {
        res.status(500).send({ message: "Error retrieving apartment with storage id=" + storage_id });
    };
}

const getApartmentByPark = async (req, res) => {
    const park_id = req.params.id;
    if (!park_id)
        res.status(404).send("The park_id is require!!")
    try {
        const park = await park_dal.getParkById(park_id);
        if (park) {
            const apartment = await Apartment_dal.getApartment(park.apartment_id);
            if (apartment) {
                res.send(apartment);
            }
            else
                res.status(404).send({ message: `Cannot find apartment with park id= ${park_id}.` });
        }
        else
            res.status(404).send({ message: `Cannot find a park with id= ${park_id}.` });
    }
    catch (err) {
        res.status(500).send({
            message: "Error retrieving apartment with park id=" + park_id
        });
    };
}

const getApartmentsDescription = async (req, res) => {
    if (!req.query.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try {
        const apartment = await Apartment_dal.getAllApartments();
        if (apartment) {
            for (let i = 0; i < apartment.length; i++) {
                const element = apartment[i];
                const entry = await Entry_dal.getEntryById(element.entry_id);
                if (entry) {
                    const building = await Building_dal.getBuildingById(entry.building_id);
                    if (building) {
                        if (building.id == req.query.building_id) {
                            var e = {
                                id: element.dataValues.id,
                                entryDescription: entry.nickname,
                                apartmentDescription: element.dataValues.description
                            }
                            response.push(e);
                        }
                    }
                    else
                        res.status(404).send({ message: `Cannot find an apartment with building id=${req.query.building_id}.` });
                }
                else
                    res.status(404).send({ message: `Cannot find an entry with id=${element.entry_id}.` });
            }
            res.send(response);
        }
        else
            res.status(404).send({ message: `Cannot find apartment in the desirable building id.` });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving apartments."
        });
    }
}

const getApartmentByResTenantName = async (req, res) => {
    const n = req.params.name;
    try {
        const apartment = await Apartment_dal.getAllApartments();
        if (apartment) {
            for (let i = 0; i < apartment.length; i++) {
                const element = apartment[i];
                const entry = await Entry_dal.getEntryById(element.entry_id);
                if (entry) {
                    const building = await Building_dal.getBuildingById(entry.building_id);
                    if (building) {
                        if (building.id == req.query.building_id) {
                            const tenant = await Tenant_dal.getTenantById(element.res_tenant_id);
                            if (tenant) {
                                if (tenant.name == name)
                                    res.send(element);
                            }
                            else res.status(404).send({ message: `Cannot find tenant with name ${name}.` });
                        }
                    }
                    else res.status(404).send({ message: `Cannot find building with id=${entry.building_id}.` });
                }
                else res.status(404).send({ message: `Cannot find entry with id ${element.entry_id}.` });
            }
        }
    }
    catch (err) {
        res.status(500).send({ message: "Error retrieving apartment with res tenant name " + name });
    }
}

const getApartmentToUpdateDebt = async (req, res) => {
    var response = [];
    const apartments = await Apartment_dal.getApartmentToUpdateDebt();
    if (apartments) {
        for (let i = 0; i < apartments.length; i++) {
            var element = apartments[i];
            // var ap = {
            //     id: element.id,
            //     entry_id: element.entry_id ,
            //     floor:element.floor, 
            //     res_tenant_id: element.res_tenant_id, 
            //     description: element.description, 
            //     num_of_rooms: element.num_of_rooms, 
            //     pay_per_month: element.pay_per_month, 
            //     debt: element.debt = element.debt + element.pay_per_month
            // };
            element.debt = element.debt + element.pay_per_month;
            await Apartment_dal.updateApartment(element.id, element.dataValues);
            var d = new Date(element.entry.building.payment_setting.next_payment);
            d.setMonth(d.getMonth() + element.entry.building.payment_setting.often);
            d.setHours(0, 0, 0, 0);
            element.entry.building.payment_setting.next_payment = d;
            const pays = await paymentSetting_dal.updatePayment_settings(element.entry.building.payment_setting.id, element.entry.building.payment_setting.dataValues);
            if (pays) {
                console.log("The update sucssedded");
            }
            else
                console.log("The update failed");
            response.push(element);
        }
        res.send(response);
    }
    else {
        res.status(404).send({ message: err.message || "Cannot find an apartment" });
    }
}

const getWeekToPayApartment = async (req, res) => {
    Apartment_dal.getWeekToPayApartment()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err.message || "Cannot find an apartment");
        })
}

module.exports = {
    createApartment,
    deleteApartment,
    updateApartment,
    getApartmentById,
    getAllApartments,
    getApartmentByTenantId,
    getApartmentsDescription,
    getApartmentByResTenantName,
    getApartmentByPark,
    getApartmentByStorage,
    getWeekToPayApartment,
    getApartmentToUpdateDebt
}