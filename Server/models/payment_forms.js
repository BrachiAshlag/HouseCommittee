
module.exports = (sequelize, DataTypes) => {
    const Payment_forms = sequelize.define("payment_forms", {
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: false
    });
    return Payment_forms;
}
