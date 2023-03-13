const { payments_settings } = require(".");
module.exports = (sequelize, DataTypes)=>{
    const Buildings = sequelize.define("buildings",{
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        city: {
            type: DataTypes.STRING, 
            allowNull: false
        }, 
        zip_code: {
            type: DataTypes.INTEGER 
        },
        street: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        num_in_streert: {
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        payment_setting_id:{
            type: DataTypes.INTEGER,
            references: payments_settings,
            referenceskey: 'id'
        },
        bank_name: DataTypes.STRING,
        bank_account: DataTypes.INTEGER ,
        branch_address: DataTypes.STRING,
        branch_num: DataTypes.INTEGER, 
        account_owner_name: DataTypes.STRING
    }, {
        timestamps: false
    });
    return Buildings;
}