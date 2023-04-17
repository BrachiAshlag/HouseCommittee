const { expenses_kinds, payment_forms, buildings } = require('.')
module.exports = (sequelize, DataTypes)=>{
    const Expense = sequelize.define("expenses", {
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        expenses_date: {
            type: DataTypes.DATE, 
            allowNull: false
        }, 
        expenses_type_id:{
            type: DataTypes.INTEGER,
            references: expenses_kinds,
            referenceskey: 'id',
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER, 
            allowNull: false
        }, 
        payment_method_id:{
            type: DataTypes.INTEGER,
            references: payment_forms,
            referenceskey: 'id', 
            allowNull: false
        },
        building_id: {
            type: DataTypes.INTEGER,
            references: buildings,
            referenceskey: 'id', 
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        permanent: {
            type: DataTypes.BOOLEAN, 
            allowNull: false
        },
        num_of_payments: {
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        receipt: DataTypes.STRING(200)
    }, {
        timestamps: false
    });
    return Expense;
}
