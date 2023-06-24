const PDFDocument = require('pdfkit');
const fs = require('fs');
const Tenants_payment_dal = require("../dal/tenant_payments-dal");
const Entry_dal = require("../dal/entry-dal");
const Building_dal = require("../dal/building-dal");
const Tenant_dal = require("../dal/tenants-dal");
const Apartment_dal = require("../dal/apartments-dal");
const mailer = require("../services/mail");

const createTenant_payment = async (req, res) => {
    try {
        const apartment = await Apartment_dal.getApartment(req.body.apartment_id);
        if (apartment) {
            const tenant = await Tenant_dal.getTenantById(apartment.res_tenant_id);
            if (tenant) {
                const path = `${process.env.PATH_FILE}/receipt-${req.body.payments_date}-apartment-${apartment.description}.pdf`
                const doc = new PDFDocument();
                doc.pipe(fs.createWriteStream(path));
                doc
                    .fontSize(27)// 5 of the tenant's name for a total of
                    .text(`Creation date: ${req.body.payments_date}\nA payment was received from apartment number****\n of ***** for a total of ****.`, 100, 100);
                // .text(`Creation date: ${req.body.payments_date}\nA payment was received from apartment number\n${apartment.description} of ${tenant.name} for a total of ${req.body.amount}.`, 100, 100);
                // .text(`תאריך הפקת האישור: ${req.body.payments_date}\nאישור תשלום\nהתקבל תשלום מדירה מס' ${apartment.description} של הדייר ${tenant.name} על סך ${req.body.amount}.`, 100, 100);
                doc.end();
                const to = tenant.email;
                const subject = "אישור עבור תשלום לוועד הבית";
                const body = "נתן לצפות בקובץ המצורף";
                const filename = `receipt-${req.body.payments_date}-apartment-${apartment.description}.pdf`;

                mailer.sendEmailWithAttachment(to, subject, body, filename, path)
                    .then(info => {
                        console.log('Email sent: ', info.response);
                    })
                    .catch(error => {
                        console.log('Error sending email: ', error);
                        res.status(500).send('Failed to send email');
                    });
                req.body.receipt = `receipt-${req.body.payments_date}-apartment-${apartment.description}.pdf`;
                const tenant_payment = await Tenants_payment_dal.createTenant_payment(req.body);
                if (tenant_payment) {
                    apartment.debt -= tenant_payment.amount;
                    await Apartment_dal.updateApartment(apartment.id, apartment.dataValues);
                    console.log("tenant_payment", tenant_payment);
                    res.send(tenant_payment);
                }
                else
                    res.status(404).send({
                        message: `Cannot create tenant payment in building ${req.query.building_id}.`
                    });
            }
            else
                res.status(404).send({
                    message: `Cannot create tenant payment in building ${req.query.building_id}.`
                });
        }
        else
            res.status(404).send({
                message: `Cannot create tenant payment in building ${req.query.building_id}.`
            });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Tenant payment."
        });
    };
}

const deleteTenant_payment = (req, res) => {
    Tenants_payment_dal.deleteTenant_payment(req.params.id)
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tenant payment was deleted successfully!"
                });
            }
            else {
                res.status(404).send({
                    message: `Cannot delete Tenant payment with id=${req.params.id}. Maybe Tenant payment was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tenant payment with id=" + req.params.id
            });
        });

}

const updateTenant_payment = (req, res) => {
    const id = req.params.id;
    Tenants_payment_dal.updateTenant_payment(id, req.body)
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tenant payment was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Tenant payment with id=${id}. Maybe expense was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tenant payment with id=" + id
            });
        });
}

const getTenant_payment = async (req, res) => {
    Tenants_payment_dal.getTenant_payment(req.params.id)
        .then(data => {
            if (data)
                res.send(data);
            else {
                res.status(404).send({
                    message: `Cannot find Tenant payment with id=${req.params.id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tenant payment with id=" + req.params.id
            });
        })
}

const getTenantsPaymentsRange = async (req, res) => {
    if (!req.query.building_id || !req.query.startDate || !req.query.endDate)
        res.status(404).send("The fields building_id, startDate and endDate required!!");
    try {
        var response = []
        const tenantPayment = await Tenants_payment_dal.getTenants_paymentsInRange(new Date(req.query.startDate), new Date(req.query.endDate));
        if (tenantPayment) {
            // console.log("tenantPayment",tenantPayment); 
            for (let i = 0; i < tenantPayment.length; i++) {
                const element = tenantPayment[i];
                const tenants = await Tenant_dal.getTenantByApartmentId(element.apartment_id);
                if (tenants) {
                    for (let j = 0; j < tenants.length; j++) {
                        const tenant = tenants[j];
                        console.log("xxxx", tenant);
                        const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
                        if (apartment) {
                            const entry = await Entry_dal.getEntryById(apartment.entry_id);
                            if (entry) {
                                const building = await Building_dal.getBuildingById(entry.building_id);
                                if (building) {
                                    if (building.id == req.query.building_id) {
                                        {
                                            const x = {
                                                date: element.payments_date,
                                                details: "תשלום לוועד הבית מ" + tenant.name,
                                                amount: element.amount,
                                                methods_of_payment: element.payment_form.description,
                                                num_of_payments: element.num_of_payments,
                                                apartment_id: apartment.id
                                            }
                                            response.push(x);
                                        }
                                    }
                                    else res.status(404).send({ message: `Cannot find building with id=${entry.building_id}.` });
                                }
                                else res.status(404).send({ message: `Cannot find entry with id ${element.entry_id}.` });
                            }
                        }
                    }
                }
                else
                    res.status(404).send({
                        message: `Cannot find tenant payment in building ${req.query.building_id}.`
                    });
            }
            res.send(response);
        }
        else
            res.status(404).send({
                message: `Cannot find tenant payment in between ${req.query.startDate} and ${req.query.endDate}.`
            });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Tenants payments."
        });
    };
}

const getTenantsPaymentsRangeByApartment = async (req, res) => {
    if (!req.params.apartment_id || !req.query.startDate || !req.query.endDate)
        res.status(404).send("The fields apartment_id, startDate and endDate required!!");
    try {
        const tenantPayment = await Tenants_payment_dal.getTenants_paymentsInRangeByApartment(req.params.apartment_id, new Date(req.query.startDate), new Date(req.query.endDate));
        if (tenantPayment) {
            res.send(tenantPayment);
        }
        else
            res.status(404).send({
                message: `Cannot find tenant payment in between ${req.query.startDate} and ${req.query.endDate}.`
            });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Tenants payments."
        });
    };
}

const getAllTenants_payments = async (req, res) => {
    try {
        const tenant_payment = await Tenants_payment_dal.getAllTenants_payments(req.params.apartment_id);
        if (tenant_payment)
            res.send(tenant_payment);
        else res.status(404).send("Apartment id is required")
    }
    catch (err) {
        res.status(500).send({ message });
    }
}

const openFile = async (req, res, next) => {
    console.log("openFile");
    if (!req.params.id)
        res.status(404).send("tenant payment id is required")
    const options = {
        root: `${process.env.PATH_FILE}`
    };

    try {
        const tenant_payment = await Tenants_payment_dal.getTenant_payment(req.params.id);
        if (tenant_payment) {
            if (tenant_payment.receipt != null) {
                const fileName = `${tenant_payment.receipt}`;
                res.sendFile(fileName, options, function (err) {
                    if (err) {
                        console.log(err);
                        next(err);
                    } else {
                        console.log('Sent:', fileName);
                    }
                });
            }
            else res.status(404).send("tenant payment id is required")
        }
        else res.status(404).send("The receipt is not valid")
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
}

module.exports = {
    createTenant_payment,
    deleteTenant_payment,
    updateTenant_payment,
    getTenant_payment,
    getTenantsPaymentsRange,
    getAllTenants_payments,
    getTenantsPaymentsRangeByApartment,
    openFile
}
