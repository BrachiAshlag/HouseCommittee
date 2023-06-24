const Tenant_dal = require("../dal/tenants-dal");
const Building_dal = require("../dal/building-dal");
const Entry_dal = require("../dal/entry-dal");
const Apartment_dal = require("../dal/apartments-dal");
const Admin_dal = require("../dal/admin-dal");
const mailer = require("../services/mail");
const generator = require('generate-password');

const bcrypt = require('bcrypt')

const adminLogin = async (req, res) => {
    console.log("adminLogin");
    const tenant_id = req.query.tenant_id;
    const password = req.query.password;
    if (!tenant_id || !password)
        return res.status(400).json({ message: 'מספר זיהוי וסיסמא נדרשים' });
    const admin = await Admin_dal.getAdminById(tenant_id);
    if (admin) {
        console.log("admin", admin);
        const match = await bcrypt.compare(password, admin.password);
        console.log("match", match);
        if (match === false)
            return res.status(401).json({ message: 'Unauthorized' });
        else {
            res.status(200).send({ message: `entered the system` });
        }
    }
    else res.status(401).json({ message: 'Unauthorized' })
}

const tenantLogin = async (req, res) => {
    const building_id = req.query.building_id;
    const tenant_id = req.query.tenant_id;
    const password = req.query.password;
    if (!building_id || !tenant_id || !password)
        return res.status(400).json({ message: 'מספר זיהוי וסיסמא נדרשים' });
    const tenant = await Tenant_dal.getTenantById(tenant_id);
    if (tenant) {
        console.log("tenant");
        const match = await bcrypt.compare(password, tenant.password);
        if (match === false){
            res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
            if (apartment) {
                console.log("apartment");
                const entry = await Entry_dal.getEntryById(apartment.entry_id);
                if (entry) {
                    console.log("entry");
                    const building = await Building_dal.getBuildingById(entry.building_id);
                    if (building) {
                        console.log("building.id", building.id);
                        console.log("building_id", building_id);
                        if (building.id == building_id) {
                            res.status(200).json({ message: "The identification was performed successfully" });
                        }
                        else res.status(401).send({ message: `Unauthorized` });
                    }
                    else res.status(401).send({ message: `Unauthorized` });
                }
                else res.status(401).send({ message: `Unauthorized` });
            }
            else res.status(401).send({ message: `Unauthorized` });
        }
        // res.status(401).json({ message: "The password is incorrect" });
    }
    else res.status(401).json({ message: 'Unauthorized' })
}

const register = async (req, res) => {
    const adminId = req.query.adminId;
    const password = req.query.password;
    if (!adminId || !password) // Confirm data
        return res.status(400).json({ message: 'מספר זיהוי וסיסמא נדרשים' })
    const admin = await Admin_dal.getAdminById(adminId);
    if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        if (!match)
            return res.status(401).json({ message: 'Unauthorized' })
        return res.status(201).json({ message: "The identification was performed successfully" });
    }
    return res.status(401).json({ message: 'Unauthorized' })
}

const forgetPassword = async (req, res) => {
    const email = req.query.email;
    const building_id = req.query.building_id;
    const tenant_id = req.query.tenant_id;
    if (!building_id || !tenant_id) // Confirm data
        return res.status(400).json({ message: 'קוד בניין ומספר זיהוי נדרשים, אם מספר הבניין חסר נתן לפנות לוועד הבית' });
    const tenant = await Tenant_dal.getTenantById(tenant_id);
    if (tenant) {
        const apartment = await Apartment_dal.getApartment(tenant.apartment_id);
        if (apartment) {
            const entry = await Entry_dal.getEntryById(apartment.entry_id);
            if (entry) {
                const building = await Building_dal.getBuildingById(entry.building_id);
                if (building) {
                    if (building.id == building_id && email == tenant.email) {
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
                            hashedPwd = await bcrypt.hash(password, 10);
                            var adm = await Tenant_dal.getByPassword(hashedPwd);
                            if (adm != undefined)
                                flag = true;
                        }
                        tenant.password = hashedPwd;
                        console.log("password", password, "hashedPwd", hashedPwd);
                        const update = await Tenant_dal.updateTenant(tenant.id, tenant.dataValues);
                        if (update[0] === 1) {
                            console.log("update", update);
                            const to = tenant.email;
                            const subject = "סיסמא חדשה לוועד הבית";
                            const body = `היי ${tenant.name}!\nעקב בקשתך ייצרנו עבורך סיסמא חדשה למערכת לניהול וועד בית \n סיסמתך החדשה היא ${password}`;

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
                        else res.status(404).send({ message: `Cannot update` });
                    }
                    else res.status(404).send({ message: `The details is not correct` });
                }
                else res.status(404).send({ message: `The details is not correct` });
            }
            else res.status(404).send({ message: `The details is not correct` });
        }
        else res.status(404).send({ message: `The details is not correct` });
    }
    else res.status(404).json({ message: "The password is incorrect" });

}



module.exports = {
    adminLogin,
    tenantLogin,
    register,
    forgetPassword
}