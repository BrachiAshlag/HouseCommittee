const { payment_forms, apartments } = require(".")

module.exports = (sequelize, DataTypes) => {
    const TenantsPayment = sequelize.define("tenant_payments", {
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        apartment_id: {
            type: DataTypes.INTEGER,
            references: apartments,
            referenceskey: 'id',
            allowNull: false
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        payments_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Approval_from_credit_company: {
            type: DataTypes.INTEGER
        },
        num_of_payments: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        payment_form_id: {
            type: DataTypes.INTEGER,
            references: payment_forms,
            referenceskey: 'id',
            allowNull: false
        },
        receipt: DataTypes.STRING(200)
    }, {
        timestamps: false
    });
    return TenantsPayment;
}