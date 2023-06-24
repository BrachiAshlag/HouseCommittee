const payment_settings = require("../dal/payment_settings-dal");
const Apartment_dal = require("../dal/apartments-dal");
const building_dal = require("../dal/building-dal");

const createPayment_settings = (req, res) => {  
    const pay = {
        same_price: req.body.same_price, 
        one_room: req.body.one_room, 
        two_rooms: req.body.two_rooms,
        three_rooms: req.body.three_rooms,
        four_rooms: req.body.four_rooms,
        five_rooms: req.body.five_rooms, 
        six_rooms: req.body.six_rooms, 
        day_in_month: req.body.day_in_month, 
        often: req.body.often,
        next_payment: new Date((new Date).getFullYear(), (new Date).getMonth() + req.body.often, req.body.day_in_month + 1)
    }
    payment_settings.createPayment_settings(pay)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Payment_settings."
          });
    });
}

const updatePayment_settings = async (req, res) => {
    const apartments = await Apartment_dal.getAllApartments(req.query.building_id);
    if(apartments){
        if(req.body.same_price != null)
            for (let i = 0; i < apartments.length; i++) {
                const element = apartments[i];
                var x = element.dataValues;
                x["pay_per_month"] = req.body.same_price;
                    await Apartment_dal.updateApartment(x["id"], x); 
            }
        else {
            for (let i = 0; i < apartments.length; i++) {
                const element = apartments[i];
                var x = element.dataValues;
                var rooms = x["num_of_rooms"];
                switch(rooms) {
                    case 1:
                        x["pay_per_month"] = req.body.one_room
                        break;
                    case 2:
                        x["pay_per_month"] = req.body.two_rooms
                        break;
                    case 3:
                        x["pay_per_month"] = req.body.three_rooms
                        break;
                    case 4:
                        x["pay_per_month"] = req.body.four_rooms
                        break;
                    case 5:
                        x["pay_per_month"] = req.body.five_rooms
                        break;
                    case 6:
                        x["pay_per_month"] = req.body.six_rooms
                        break;
                }
                await Apartment_dal.updateApartment(x["id"], x); 
            }
        }
        await payment_settings.updatePayment_settings(req.body.id, req.body);
        res.send({
            message: "payment settings was updated successfully."
        });
    }
    else
    res.status(404).send({
        message: `Cannot find apartments in building ${req.body.building_id}.`
    });   
}

const getLastPayment_settings = async (req, res) => {
    payment_settings.getLastPaymentSettings()
    .then(data=>{
        if (data) 
            res.send(data);
        else
            res.status(404).send({
                message: `Cannot models.`
            });  
    })
    .catch (err=>{
        res.status(500).send({
            message: "Error retrieving last payment settings"
        });
    });  
}

const getPayment_settingsById = async (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    try{
        const building = await building_dal.getBuildingById(req.query.building_id);
        if(building){
            const settings = await payment_settings.getPaymentSettingsById(building.payment_setting_id);
            if(settings){
                res.send(settings);
            }
            else
            res.status(404).send({
                message: `Cannot find settings in building ${req.query.building_id}.`
            });
        }
        else
        res.status(404).send({
            message: `Cannot find settings in building ${req.query.building_id}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving parks."
        });
    }   
}


module.exports = {
    createPayment_settings,
    updatePayment_settings,
    getLastPayment_settings,
    getPayment_settingsById
}
