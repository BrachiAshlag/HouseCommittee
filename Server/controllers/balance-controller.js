const Expenses_dal = require("../dal/expense-dal");
const Tenant_payments_dal = require("../dal/tenant_payments-dal");

const getBalance = async (req, res) => {
    if(!req.query.building_id|| !req.query.startDate|| !req.query.endDate)
        res.status(404).send("The fields building_id, startDate and endDate required!!");
    var i=0;
    var balance = [];
    try{
        const data = await Expenses_dal.getExpensesInRange(req.query.building_id, req.query.startDate, req.query.endDate);
        if(data){
            console.log("data from dal", data);
            data.forEach(element => {
                console.log("element", element);
                let x = {
                    date: element.expenses_date,
                    type: "הוצאה",
                    amount: element.amount,
                    details: element.expenses_kind.description,
                    balance: null
                }
                balance[i++]=x;
            })
        }
        else
            res.status(404).send({
                message: `Cannot find expense between ${req.query.startDate} and ${req.query.endDate}.`
            });
        const tenantsPayment = Tenant_payments_dal.getTenants_paymentsInRange(req.query.startDate, req.query.endDate);
        if (tenantsPayment) {
            for (let i = 0; i < tenantsPayment.length; i++) {
                const element = tenantsPayment[i];
                const apartment = await Apartment_dal.getApartment(element.apartment_id);
                if (apartment) {
                    const entry = await Entry_dal.getEntryById(apartment.entry_id);
                    if (entry) {
                        const building = await Building_dal.getBuildingById(entry.building_id);
                        if (building) {
                            if (building.id == req.query.building_id) {
                                const tenant = await Tenant_dal.getTenantByApartmentId(element.apartment_id);
                                if (tenant) {
                                    let x = {
                                        date: element.payments_date,
                                        type: "הכנסה",
                                        amount: element.amount,
                                        details: "House committee payment",
                                        balance: null
                                    }
                                    balance[i++]=x;
                                }
                                else
                                    res.status(404).send({
                                        message: `Cannot find tenant payment in building ${req.query.building_id}.`
                                    });
                            }
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
                message: `Cannot find tenant payment in between ${req.query.startDate} and ${req.query.endDate}.`
            });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving balance."
        });
    }
    balance.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
    });
    var b = 0;
    balance.forEach(element => {
        if(element.type=="income")
            b+=element.amount;
        else
            b-=element.amount;
        element.balance = b;
    })
    res.send({balance})
}

module.exports = {
    getBalance
}
