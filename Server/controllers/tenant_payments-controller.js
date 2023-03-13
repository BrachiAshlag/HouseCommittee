const PDFDocument = require('pdfkit');
const fs = require('fs');
const Tenants_payment_dal = require("../dal/tenant_payments-dal");
const Tenant_dal = require("../dal/tenants-dal");
const Apartment_dal = require("../dal/apartments-dal");
const mailer = require("../services/mail");

const createTenant_payment = async (req, res) => {  
    try{
        const apartment = await Apartment_dal.getApartment(req.body.apartment_id);
        if(apartment){
            const tenant = await Tenant_dal.getTenantById(apartment["res_tenant_id"]);
            if(tenant){
                const path = `./files/receipt-${req.body.payments_date}-apartment-${apartment["description"]}.pdf`
                const doc = new PDFDocument();
                doc.pipe(fs.createWriteStream(path));
                doc
                    .fontSize(27)
                    .text(`receipt-${req.body.payments_date}-apartment-${apartment["description"]}.pdf`, 100, 100);
                doc.end(); 
                const to = tenant["email"];
                const subject = "receipt on  tenant payment";
                const body = "look at the attached file";
                const filename = `receipt-${req.body.payments_date}-apartment-${apartment["description"]}.pdf`;

                mailer.sendEmailWithAttachment(to, subject, body, filename, path)
                    .then(info => {
                        console.log('Email sent: ', info.response);
                    })
                    .catch(error => {
                        console.log('Error sending email: ', error);
                        res.status(500).send('Failed to send email');
                    });
                req.body.receipt = path;
                const tenant_payment = await Tenants_payment_dal.createTenant_payment(req.body);
                if(tenant_payment){
                    apartment.debt -= tenant_payment.amount;
                    apartment = await Apartment_dal.updateApartment(apartment.id, apartment.dataValues);
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
    catch(err){
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
    const id=req.params.id;
    Tenants_payment_dal.updateTenant_payment(id ,req.body)
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
    .catch(err=>{
        res.status(500).send({
            message: "Error retrieving Tenant payment with id=" + req.params.id
        });
    })    
}

const getAllTenants_payments = async (req, res) => {
    try{
        var response = []
        const data1 = await Tenants_payment_dal.getTenants_paymentsInRange(req.query.startDate, req.query.endDate);   
        if(data1){  
            console.log(data1);
            for (let i = 0; i < data1.length; i++) {
                const element = data1[i];
                const data2 = await Tenant_dal.getTenantByApartmentId(element.dataValues["apartment_id"]);
                if(data2){
                    const x = {
                        "date": element.dataValues["payments_date"],
                        "details": "House committee payment from "+ data2[0].dataValues["name"]+ " family",
                        "amount": element.dataValues["amount"],
                        "methods_of_payment": element.dataValues["payment_form"].dataValues["description"],
                        "num_of_payments": element.dataValues["num_of_payments"]
                    }
                    response.push(x);
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
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Tenants payments."
        });
    };
}

module.exports = {
    createTenant_payment,
    deleteTenant_payment,
    updateTenant_payment,
    getTenant_payment,
    getAllTenants_payments
}
