const Expences_dal = require("../dal/expense-dal");
const Tenant_payments_dal = require("../dal/tenant_payments-dal");

const getBalance = async (req, res) => {
    if(!req.query.building_id|| !req.body.startDate|| !req.body.endDate)
        res.status(404).send("The fields building_id, startDate and endDate required!!");

    var i=0;
    var balance = [];
    console.log(req.query.building_id, req.body.startDate, req.body.endDate) ;
    try{
        const data = await Expences_dal.getExpensesInRange(req.query.building_id, req.body.startDate, req.body.endDate);
        if(data){
            data.forEach(element => {
                let x = {
                    "date": element.dataValues["date_of_expenses"],
                    "type": "expense",
                    "amount": element.dataValues["amount"],
                    "details": element.dataValues["expenses_kind"].dataValues["description"],
                    "balance": null
                }
                balance[i++]=x;
            })
        }
        else
            res.status(404).send({
                message: `Cannot find expense between ${req.body.startDate} and ${req.body.endDate}.`
            });
        
        const data2 = await Tenant_payments_dal.getTenants_paymentsInRange( req.body.startDate, req.body.endDate);
        if(data2){
            data2.forEach(element => {
                let x = {
                    "date": element.dataValues["payments_date"],
                    "type": "income",
                    "amount": element.dataValues["amount"],
                    "details": "House committee payment",
                    "balance": null
                }
                balance[i++]=x;
                console.log(balance);
            });
        }
        else
            res.status(404).send({
                message: `Cannot find expense between ${req.body.startDate} and ${req.body.endDate}.`
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
        if(element["type"]=="income")
            b+=element["amount"];
        else
            b-=element["amount"];
        element["balance"] = b;
    })
    res.send({balance})
}

module.exports = {
    getBalance
}
