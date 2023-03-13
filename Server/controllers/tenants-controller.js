const Tenant_dal = require("../dal/tenants-dal");
const Apartment_dal = require("../dal/apartments-dal");
const Entry_dal = require("../dal/entry-dal");
const Building_dal = require("../dal/building-dal");
const mailer = require("../services/mail");
const generator = require('generate-password');
const bcrypt = require("bcrypt");
const ParkingPermits_dal = require("../dal/parking_premit-dal")

function IDValidator(id) {
    if (id.length !== 9 || isNaN(id)) {  // Make sure ID is formatted properly
        return false;
    }
    let sum = 0, incNum;
    for (let i = 0; i < id.length; i++) {
        incNum = Number(id[i]) * ((i % 2) + 1);  // Multiply number by 1 or 2
        sum += (incNum > 9) ? incNum - 9 : incNum;  // Sum the digits up and add to total
    }
    return (sum % 10 === 0);
}

const createTenant = async (req, res) => {
    if (!req.body.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    if (!IDValidator(String(req.body.id))) {
        res.status(400).send({
            message: "The ID is not valid"
        });
        return;
    }
    var flag = false;
    var password = null;
    while(!flag){
        password = generator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
            strict: true
        });
        console.log(password);
        hashedPwd = await bcrypt.hash(password, 10)
        const tenant = await Tenant_dal.getByPassword(hashedPwd);
        if(tenant != undefined) 
            flag=true;
    }
    
    const x = {
        "id": req.body.id,
        "name":  req.body.name,
        "birth_date": req.body.birth_date,
        "email":  req.body.email,
        "phone": req.body.phone,
        "apartment_id": req.body.apartment_id,
        "Is_building_comittee": req.body.Is_building_comittee,
        "car_id": req.body.car_id,
        "password": hashedPwd
    }
    Tenant_dal.createTenant(x)
        .then(data => {
            const to = data.dataValues["email"];
            console.log(to);
            const subject = "Successfully added tenant";
            const body = "Successfully added tenant, your password is: "+ password;
        
            mailer.sendEmail(to, subject, body)
                .then(info => {
                    console.log('Email sent: ', info.response);
                    res.send("The message's sending successful, tenant created!!\n"+data);
                    // res.send();
                })
                .catch(error => {
                    console.log('Error sending email: ', error);
                    res.status(500).send('Failed to send email');
                });
            
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tenant."
            });
        });
}

const deleteTenant = (req, res) => {
    const id = req.params.id;
    Tenant_dal.deleteTenant(id)
        .then(num => {
            if (num == 1)
                res.send({
                    message: "tenant was deleted successfully!"
                });
            else
                res.send({
                    message: `Cannot delete tenant with id=${id}. Maybe tenant was not found!`
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete tenant with id=" + id
            });
        });
}

const updateTenant = (req, res) => {
    const id = req.params.id;
    Tenant_dal.updateTenant(id, req.body)
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "tenant was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update tenant with id=${id}. Maybe tenant was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating tenant with id=" + id
            });
        });
}

const getTenantById = (req, res) => {
    const id = req.params.id;
    Tenant_dal.getTenantById(id)
        .then(data => {
            if (data)
                res.send(data);
            else
                res.status(404).send({
                    message: `Cannot find tenant with id=${id}.`
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving tenant with id=" + id
            });
        });
}

const getTenantByApartmentId = (req, res) => {
    const id = req.params.id;
    Tenant_dal.getTenantByApartmentId(id)
    .then(data => {
        if (data)
            res.send(data);
        else
            res.status(404).send({
                message: `Cannot find tenant with apartment id= ${carNum}.`
            });
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving tenant with apartment id=" + carNum
        });
    });
}

const getTenantByName = async(req, res) => {
    const Name = req.params.Name;
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    if(!Name)
        res.status(404).send("The field name required");
    var response = [];
    try {
        const tenants = await Tenant_dal.getTenantByName(Name)
        if(tenants){
            for (let i = 0; i < tenants.length; i++) {
                const element = tenants[i];
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
                            message: `Cannot find building with id=${entry.building_id}.`
                        });
                    }
                    else
                        res.status(404).send({
                            message: `Cannot find entry with id=${apartment.entry_id}.`
                        });
                }
                else
                res.status(404).send({
                    message: `Cannot find apartment with id=${element.apartment_id}.`
                });
            }
        }
        else
            res.status(404).send({
                message: `Cannot find tenants at all.`
            });
        res.send(response);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tenants."
        });
    };
}

const getTenantByPhone = (req, res) => {
    const phone = req.params.phone;
    Tenant_dal.getTenantByPhone(phone)
        .then(data => {
            if (data)
                res.send(data);
            else
                res.status(404).send({
                    message: `Cannot find tenant with phone number ${phone}.`
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving tenant with phone number " + phone
            });
        });
}

const getTenantByCarNum = async(req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    const carNum = req.params.carNum;
    if(!carNum)
        res.status(404).send("The field carNum required");
    console.log(carNum);
    var response = [];
    try {
        const tenants = await Tenant_dal.getTenantByCarNum(carNum);
        if(tenants){
            for (let i = 0; i < tenants.length; i++) {
                const element = tenants[i];
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
                            message: `Cannot find building with id=${entry.building_id}.`
                        });
                    }
                    else
                        res.status(404).send({
                            message: `Cannot find entry with id=${apartment.entry_id}.`
                        });
                }
                else
                res.status(404).send({
                    message: `Cannot find apartment with id=${element.apartment_id}.`
                });
            }
        }
        else
            res.status(404).send({
                message: `Cannot find tenants at all.`
            });
        res.send(response);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tenants."
        });
    };
}

const getAllTenants = async (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try {
        const tenants = await Tenant_dal.getAllTenants();
        if(tenants){
            for (let i = 0; i < tenants.length; i++) {
                const element = tenants[i];
                console.log(element.apartment_id);
                const apartment = await Apartment_dal.getApartment(element.apartment_id);
                if(apartment){
                    const entry = await Entry_dal.getEntryById(apartment.entry_id);
                    if(entry){
                        const building = await Building_dal.getBuildingById(entry.building_id);
                        if(building){
                            if (building.id == req.query.building_id)
                            console.log(element.dataValues);
                                response.push(element.dataValues);
                        }
                        else
                        res.status(404).send({
                            message: `Cannot find building with id=${entry.building_id}.`
                        });
                    }
                    else
                        res.status(404).send({
                            message: `Cannot find entry with id=${apartment.entry_id}.`
                        });
                }
                else
                res.status(404).send({
                    message: `Cannot find apartment with id=${element.apartment_id}.`
                });
            }
        }
        else
        res.status(404).send({
            message: `Cannot find tenants at all.`
        });
        console.log("sdefgvhbjnkm")
        return res.send(response);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tenants."
        });
    };
}

const getTenantWhereParkingPermitIsTrue = async (req, res) => {//שולחים גם פרמס וגם קוארי כדי שהוא יקלוט שלא הכוונה לשליפת גט רגילה
    console.log(req.params.Building_id)
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try {
        const premits = await ParkingPermits_dal.getAllParking_premits();
        if(premits){
            for (let i = 0; i < premits.length; i++) {
                const element = premits[i];
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
        }
        else
        res.status(404).send({
            message: `Cannot find parking premit in building ${req.query.building_id}.`
        });
        var response2 = []
        for (let i = 0; i < response.length; i++) {
            const element = response[i];
            if (element.is_allowed == true){
                const tenant = await Tenant_dal.getTenantById(element.tenant_id);
                if(tenant)
                    response2.push(tenant);
                else
                res.status(404).send({
                    message: `Cannot find tenant with id =${element.tenant_id}.`
                });
            }
        }
        res.send(response2);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tenants."
        });
    };
}

const postSendMsgToManager = (req, res) => {
    const to = req.body.to;
    const subject = req.body.subject;
    const body = req.body.body;
    const filename = req.body.filename;
    const path = req.body.path;
    mailer.sendEmailWithAttachment(to, subject, body, filename, path)
        .then(info => {
            console.log('Email sent: ', info.response);
            res.send("The message's sending successful");
        })
        .catch(error => {
            console.log('Error sending email: ', error);
            res.status(500).send('Failed to send email');
        });
}

module.exports = {
    createTenant,
    deleteTenant,
    updateTenant,
    getTenantById,
    getAllTenants,
    getTenantByName,
    getTenantByCarNum,
    getTenantByApartmentId,
    getTenantByPhone,
    postSendMsgToManager,
    getTenantWhereParkingPermitIsTrue,
}