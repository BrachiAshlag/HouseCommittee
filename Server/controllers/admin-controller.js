const Admin_dal = require("../dal/admin-dal");
const generator = require("generate-password");
const bcrypt = require("bcrypt");
const mailer = require("../services/mail");

const createAdmin = async(req, res) => {  
    if (!req.body.id) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
    }
    var admin = req.body;
    var flag = false;
    var password = null;
    var hashedPwd = null;
    while(!flag){
        password = generator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
            strict: true
        });
        hashedPwd = await bcrypt.hash(password, 10)
        const adm = await Admin_dal.getAdminByPassword(hashedPwd)
        if(adm == undefined) 
           flag=true;
    }
    admin.password = hashedPwd;
    Admin_dal.createAdmin(admin)
    .then(data =>{
        const to = req.body.email;
        const subject = `You have successfully registered to our building committee management system`;
        const body = `you are registered as an administrator. 
        Your password is ${password}`;

        mailer.sendEmail(to, subject, body)
            .then(info => {
                console.log('Email sent: ', info.response);
                res.send("Admin was sucssesfuly created, email with the password send to him");
            })
            .catch(error => {
                console.log('Error sending email: ', error);
                res.status(500).send('Failed to send email');
            });
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Admin."
          });
    });
}

const deleteAdmin = (req, res) => {
    Admin_dal.deleteAdmin(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Admin was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete admin with id=${req.params.id}. Maybe admin was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete admin with id=" + req.params.id
        });
    });

}

const getAllAdmins = async (req, res) => {
    try{
        const admins = await Admin_dal.getAllAdmins();
        if(admins){
            res.send(admins);
        }
        else
        res.status(404).send({
            message: `Cannot find apartment with id=${id}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Admins."
        });
    }   
}

const getAdminById = async(req, res) =>{
    try{
        const admin = await Admin_dal.getAdminById(req.params.id);
        if(admin){
            res.send(admin);
        }
        else
        res.status(404).send({
            message: `Cannot find Admin with id=${req.params.id}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Admins."
        });
    }   
}

module.exports = {
    createAdmin,
    deleteAdmin,
    getAllAdmins,
    getAdminById
}
