const Tenant_dal = require("../dal/tenants-dal");
const Building_dal = require("../dal/building-dal");
const Entry_dal = require("../dal/entry-dal");
const Apartment_dal = require("../dal/apartments-dal");
const Admin_dal = require("../dal/admin-dal");
const mailer = require("../services/mail");
const generator = require('generate-password');
const tenantController = require("../controllers/tenants-controller");

const bcrypt = require('bcrypt')

const login = async (req, res) => {//לבדוק אחרי שמאחדים את הפרוייקטים אם עובד אחרי שיש אפשרות להוסיף דייר עם סיסמא מוצפנת
    const building_id = req.body.building_id;
    const tenant_id = req.body.tenant_id;
    const password = req.body.password;
    if (!building_id || !tenant_id || !password) // Confirm data
        return res.status(400).json({ message: 'All fields are required' });
    const tenant = await Tenant_dal.getTenantById(tenant_id);
    if (tenant) {
        var hashedPwd = await bcrypt.hash(password, 10)
        console.log(hashedPwd);
        const match = await bcrypt.compare(password, tenant.password);
        if (match === false)
            return res.status(401).json({ message: 'Unauthorized' });
        else {
            const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
            if (apartment) {
                const entry = await Entry_dal.getEntryById(apartment.entry_id);
                if (entry) {
                    const building = await Building_dal.getBuildingById(entry.building_id);
                    if (building) {
                        if (building.id == building_id)
                            res.status(201).json({ message: "The identification was performed successfully" });
                    }
                    else res.status(404).send({ message: `Cannot find building with id=${entry.building_id}.` });
                }
                else res.status(404).send({ message: `Cannot find entry with id=${apartment.entry_id}.` });
            }
            else res.status(404).send({ message: `Cannot find apartment with id=${tenant.apartment_id}.` });
        }
        // res.status(404).json({ message: "The password is incorrect" });
    }
    else res.status(400).json({ message: 'Unauthorized' })
}

const register = async (req, res) => {
    const adminId = req.body.adminId;
    const password = req.body.password;
    if (!adminId || !password) // Confirm data
        return res.status(400).json({ message: 'All fields are required' })
    const admin = await Admin_dal.getAdminById(adminId);
    if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        if (!match)
            return res.status(401).json({ message: 'Unauthorized' })
        return res.status(201).json({ message: "The identification was performed successfully" });
    }
    return res.status(400).json({ message: 'Unauthorized' })
}

const forgetPassword = async (req, res) => {
    const building_id = req.body.building_id;
    const tenant_id = req.body.tenant_id;
    if (!building_id || !tenant_id) // Confirm data
        return res.status(400).json({ message: 'All fields are required' });
    const tenant = await Tenant_dal.getTenantById(tenant_id);
    if (tenant) {
        console.log(tenant);
        const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
        if (apartment) {
            const entry = await Entry_dal.getEntryById(apartment.entry_id);
            if (entry) {
                const building = await Building_dal.getBuildingById(entry.building_id);
                if (building) {
                    if (building.id == building_id) {
                        var flag = false;
                        var password = null;
                        var hashedPwd = null;
                        while (!flag) {
                            password = generator.generate({
                                length: 10,
                                numbers: true,
                                uppercase: true,
                                lowercase: true,
                                strict: true
                            });
                            console.log(password);
                            hashedPwd = await bcrypt.hash(password, 10)
                            console.log(hashedPwd);
                            var adm = await Tenant_dal.getByPassword(hashedPwd);
                            if (adm != undefined)
                                flag = true;
                        }

                        tenant.password = hashedPwd;
                        await Tenant_dal.updateTenant(tenant.id, tenant);
                        const to = tenant.email;
                        const subject = "Restoring your password to the system and the Building Committee";
                        const body = `Your password is ${password}`;

                        mailer.sendEmail(to, subject, body)
                            .then(info => {
                                console.log('Email sent: ', info.response);
                                res.send("successfuly!!!!!!!!!!!!!!!!!!!!!!")
                            })
                            .catch(error => {
                                console.log('Error sending email: ', error);
                                res.status(500).send('Failed to send email');
                            });
                    }
                }
                else res.status(404).send({ message: `Cannot find building with id=${entry.building_id}.` });
            }
            else res.status(404).send({ message: `Cannot find entry with id=${apartment.entry_id}.` });
        }
        else res.status(404).send({ message: `Cannot find apartment with id=${tenant.apartment_id}.` });
    }
    else res.status(404).json({ message: "The password is incorrect" });

}

module.exports = {
    login,
    register,
    forgetPassword
}