const Tenant_dal = require("../dal/tenants-dal");
const Apartment_dal = require("../dal/apartments-dal");
const Entry_dal = require("../dal/entry-dal");
const Building_dal = require("../dal/building-dal");
const mailer = require("../services/mail");
const generator = require('generate-password');
const bcrypt = require("bcrypt");


function IDValidator(id) {
    if (id.length !== 9 || isNaN(id)) {
        return false;
    }
    let sum = 0, incNum;
    for (let i = 0; i < id.length; i++) {
        incNum = Number(id[i]) * ((i % 2) + 1);
        sum += (incNum > 9) ? incNum - 9 : incNum;
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
    while (!flag) {
        password = generator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
            strict: true
        });
        hashedPwd = await bcrypt.hash(password, 10)
        const tenant = await Tenant_dal.getByPassword(hashedPwd);
        if (tenant != undefined)
            flag = true;
    }
    console.log("req.body", req.body);

    const x = {
        id: req.body.id,
        name: req.body.name,
        birth_date: req.body.birth_date,
        email: req.body.email,
        phone: req.body.phone,
        apartment_id: req.body.apartment_id,
        is_building_committee: req.body.is_building_committee,
        car_id: req.body.car_id ? req.body.car_id : null,
        parking_premit: req.body.parking_premit,
        password: hashedPwd
    }

    Tenant_dal.createTenant(x)
        .then(data => {
            const to = data.email; ''
            const subject = "הדייר נוסף בהצלחה למערכת";
            const body = "נרשמת כדייר/ת במערכת לניהול וועד בית, סיסמתך היא " + password;

            mailer.sendEmail(to, subject, body)
                .then(info => {
                    console.log('Email sent: ', info.response);
                    res.send("The message's sending successful, tenant created!!\n" + data);
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
                res.status(404).send({
                    message: `Cannot update tenant with id= ${id}. Maybe tenant was not found or req.body is empty!`
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

const getAllTenantData = async (req, res) => {
    const id = req.params.id;
    try {
        const tenant = await Tenant_dal.getTenantById(id);
        if (tenant) {
            const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
            if (apartment) {
                const entry = await Entry_dal.getEntryById(apartment.entry_id);
                if (entry) {
                    const building = await Building_dal.getBuildingById(entry.building_id);
                    if (building) {
                        const data = {
                            id: tenant.id,
                            name: tenant.name,
                            apartment_id: apartment.id,
                            entry_id: entry.id,
                            building_id: entry.building_id,
                            is_building_committee: tenant.is_building_committee,
                            apartment_num: apartment.description,
                            entry_num: entry.nickname,
                            address: building.street + " " + building.num_in_street + " " + building.city
                        }
                        res.send(data);
                    }
                    else
                        res.status(404).send({
                            message: `Cannot find tenant with id=${req.params.id}.`
                        });
                }
                else
                    res.status(404).send({
                        message: `Cannot find tenant with id=${req.params.id}.`
                    });
            }
            else
                res.status(404).send({
                    message: `Cannot find tenant with id=${req.params.id}.`
                });
        } else
            res.status(404).send({
                message: `Cannot find tenant with id=${req.params.id}.`
            });
    }
    catch (err) {
        res.status(500).send({
            message: "Error retrieving tenant with id=" + id
        });
    }

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

const getTenantByName = async (req, res) => {
    const Name = req.params.Name;
    if (!req.query.building_id)
        res.status(404).send("The field building_id required");
    if (!Name)
        res.status(404).send("The field name required");
    var response = [];
    try {
        const tenants = await Tenant_dal.getTenantByName(Name)
        if (tenants) {
            for (let i = 0; i < tenants.length; i++) {
                const element = tenants[i];
                const apartment = await Apartment_dal.getApartment(element.apartment_id);
                if (apartment) {
                    const entry = await Entry_dal.getEntryById(apartment.entry_id);
                    if (entry) {
                        const building = await Building_dal.getBuildingById(entry.building_id);
                        if (building) {
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

const getTenantByPhone = async (req, res) => {
    if (!req.query.building_id)
        res.status(404).send("The field building_id required");
    const phone = req.params.phone;
    try {
        const tenant = await Tenant_dal.getTenantByPhone(phone);
        if (tenant) {
            for (let i = 0; i < tenant.length; i++) {
                const element = tenant[i];
                const apartment = await Apartment_dal.getApartment(element.apartment_id);
                if (apartment) {
                    const entry = await Entry_dal.getEntryById(apartment.entry_id);
                    if (entry) {
                        const building = await Building_dal.getBuildingById(entry.building_id);
                        if (building) {
                            if (building.id == req.query.building_id)
                                res.send(tenant)
                            else
                                res.status(404).send({
                                    message: `Cannot find tenant with phone ${phone}.`
                                });
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
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tenants."
        });
    };
}

const getTenantByCarNum = async (req, res) => {
    if (!req.query.building_id)
        res.status(404).send("The field building_id required");
    const carNum = req.params.carNum;
    if (!carNum)
        res.status(404).send("The field carNum required");
    var response = [];
    try {
        const tenants = await Tenant_dal.getTenantByCarNum(carNum);
        if (tenants) {
            for (let i = 0; i < tenants.length; i++) {
                const element = tenants[i];
                const apartment = await Apartment_dal.getApartment(element.apartment_id);
                if (apartment) {
                    const entry = await Entry_dal.getEntryById(apartment.entry_id);
                    if (entry) {
                        const building = await Building_dal.getBuildingById(entry.building_id);
                        if (building) {
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
    if (!req.query.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try {
        const tenants = await Tenant_dal.getAllTenants();
        if (tenants) {
            for (let i = 0; i < tenants.length; i++) {
                const tenant = tenants[i];
                const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
                if (apartment) {
                    const entry = await Entry_dal.getEntryById(apartment.entry_id);
                    if (entry) {
                        const building = await Building_dal.getBuildingById(entry.building_id);
                        if (building) {
                            if (building.id == req.query.building_id)
                                response.push(tenant);
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
        return res.send(response);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tenants."
        });
    };
}

const getTenantWhereParkingPermitIsTrue = async (req, res) => {
    if (!req.params.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try {
        const tenants = await Tenant_dal.getAllTenants();
        if (tenants) {
            for (let i = 0; i < tenants.length; i++) {
                const tenant = tenants[i];
                if (tenant.parking_premit == true) {
                    const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
                    if (apartment) {
                        const entry = await Entry_dal.getEntryById(apartment.entry_id);
                        if (entry) {
                            const building = await Building_dal.getBuildingById(entry.building_id);
                            if (building) {
                                if (building.id == req.params.building_id)
                                    response.push(tenant);
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
            }
        }
        else
            res.status(404).send({
                message: `Cannot find parking premit in building ${req.query.building_id}.`
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

const getTenantWhereParkingPermitIsFalse = async (req, res) => {
    if (!req.params.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try {
        const tenants = await Tenant_dal.getAllTenants();
        if (tenants) {
            for (let i = 0; i < tenants.length; i++) {
                const tenant = tenants[i];
                if (tenant.parking_premit == false) {
                    const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
                    if (apartment) {
                        const entry = await Entry_dal.getEntryById(apartment.entry_id);
                        if (entry) {
                            const building = await Building_dal.getBuildingById(entry.building_id);
                            if (building) {
                                console.log("building.id == req.query.building_id", building.id, req.query.building_id);
                                if (building.id == req.params.building_id)
                                    response.push(tenant);
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
            }
        }
        else
            res.status(404).send({
                message: `Cannot find parking premit in building ${req.query.building_id}.`
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

const changePassword = async (req, res) => {
    try {
        const tenant_id = req.params.tenant_id;
        const newPassword = req.query.newPassword;
        const oldPassword = req.query.oldPassword;

        const tenant = await Tenant_dal.getTenantById(tenant_id);
        if (tenant) {
            console.log("tenant", tenant);
            const match = await bcrypt.compare(oldPassword, tenant.password);
            if (match === true) {
                const hashedPwd = await bcrypt.hash(newPassword, newPassword.length);
                tenant.password = hashedPwd;
                const update = await Tenant_dal.updateTenant(tenant.id, tenant);
                if (update) {
                    res.status(200).send(tenant);
                }
                else
                    res.status(404).send({
                        message: `Cannot update tenant's password with id =${element.tenant_id}.`
                    });
            }
            else
                res.status(404).send({
                    message: `The details is incorrect.`
                });
        }
        else
            res.status(404).send({
                message: `The details is incorrect.`
            });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tenants."
        });
    }
}

module.exports = {
    createTenant,
    deleteTenant,
    updateTenant,
    getTenantById,
    getAllTenantData,
    getAllTenants,
    getTenantByName,
    getTenantByCarNum,
    getTenantByApartmentId,
    getTenantByPhone,
    postSendMsgToManager,
    getTenantWhereParkingPermitIsTrue,
    getTenantWhereParkingPermitIsFalse,
    changePassword
}