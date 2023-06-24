const apartment_con = require("../controllers/apartments-controller");
const mailer = require("./mail");
const Tenant_dal = require("../dal/tenants-dal");
// const Parking_premits_dal = require("../dal/parking_premit-dal");
const Apartment_dal = require("../dal/apartments-dal");
const payment_setting_dal = require("../dal/payment_settings-dal");

const updateDebt = async () => {
    // const ap = await apartment_con.getApartmentToUpdateDebt();
    var response = [];
    const apartments = await Apartment_dal.getApartmentToUpdateDebt();
    if (apartments) {
        for (let i = 0; i < apartments.length; i++) {
            var element = apartments[i];
            element.debt = element.debt + element.pay_per_month;
            await Apartment_dal.updateApartment(element.id, element.dataValues);
            var d = new Date(element.entry.building.payment_setting.next_payment);
            d.setMonth(d.getMonth()+element.entry.building.payment_setting.often);
            d.setDate(element.entry.building.payment_setting.day_in_month + 1);
            d.setHours(0,0,0,0);
            element.entry.building.payment_setting.next_payment = d;
            const pays = await payment_setting_dal.updatePayment_settings(element.entry.building.payment_setting.id, element.entry.building.payment_setting.dataValues);
            if(pays){
                const email = element.tenant.email;
                mailer.sendEmail(email, "חוב לוועד הבית שלך",`שלום ${element.tenant.name}!\n מהיום ועד ה ${element.entry.building.payment_setting.next_payment.toLocaleString().slice(0,9)} עליך לשלם את חובך לוועד הבית שלך העומד על סך ${element.debt} שקלים.`)
                    .then(info => {
                        console.log('Email sent: ', info.response);
                    })
                    .catch(error => {
                        console.log('Error sending email: ', error);
                    });
            }
            else
                console.log("The update failed");
            response.push(element);
        }
        return response;
    }
    else {
        res.status(404).send({ message: err.message || "Cannot find an apartment" });
    }
}

const weekToPay = async () => {
    const ap = await Apartment_dal.getWeekToPayApartment();
    if (ap) {
        for (let i = 0; i < ap.length; i++) {
            const element = ap[i];
            const email = element.tenant.email;
            mailer.sendEmail(email, `נותר שבוע לגביית דמי וועד הבית` , `היי ${element.tenant.name}!\nבתוך שבוע תצטרך לשלם את דמי וועד הבית שלך.\nהסכום לתשלןם הוא ${element.pay_per_month}`)
                .then(info => {
                    console.log('Email sent: ', info.response);
                })
                .catch(error => {
                    console.log('Error sending email: ', error);
                });
        }
    }
    else {
        console.log("The mail send failed");
    }
    // apartment_con.getWeekToPayApartment()
    //     .then(ap => {
    //         if (!ap)
    //             console.log('!ap');
    //         console.log(ap);
    //         for (let i = 0; i < ap.length; i++) {
    //             const element = ap[i];
    //             console.log(element.tenant.email);
    //             const email = element.tenant.email;
    //             mailer.sendEmail(email, `A week for the collect`, `Hi ${element.tenant.name}!\n in a week you will have to pay your house committee your ststic payment.\nYour amount for paying is ${element.pay_per_month}`)
    //                 .then(info => {
    //                     console.log('Email sent: ', info.response);
    //                 })
    //                 .catch(error => {
    //                     console.log('Error sending email: ', error);
    //                 });
    //         }
    //     })
}

const late = async () => {
    try {
        const apartments = await Apartment_dal.getAllApartments();
        if (apartments) {
            for (let i = 0; i < apartments.length; i++) {
                const element = apartments[i];
                if (element.debt > element.pay_per_month) {
                    const tenants = await Tenant_dal.getTenantByApartmentId(element.id);
                    for (let j = 0; j < tenants.length; j++) {
                        const element2 = tenants[j];
                        if (element2.parking_premit == 1) {
                            element2.parking_premit = 0;
                            await Tenant_dal.updateTenant(element2.id, element2.dataValues);
                        }
                    }
                    const res = await Tenant_dal.getTenantById(element.res_tenant_id);
                    const email = res.email;
                    mailer.sendEmail(email, `היי ${res.name}!\nהנך מאחר/ת בתשלום דמי וועד הבית שלך`, `חובך עומד על סך ${element.debt - element.pay_per_month}`)
                        .then(info => {
                            console.log('Email sent: ', info.response);
                        })
                        .catch(error => {
                            console.log('Error sending email: ', error);
                        });
                }

            }
        }
        else console.log("Cannot find ant apartment");
    }
    catch (err) {
        console.log(err);
    };
}

module.exports = { updateDebt, weekToPay, late }