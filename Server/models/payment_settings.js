const { buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Payments_settings = sequelize.define("payment_settings", {
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        same_price: DataTypes.INTEGER,
        one_room: DataTypes.INTEGER,
        two_rooms: DataTypes.INTEGER,
        three_rooms: DataTypes.INTEGER,
        four_rooms: DataTypes.INTEGER,
        five_rooms: DataTypes.INTEGER,
        six_rooms: DataTypes.INTEGER,
        day_in_month: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        often: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        next_payment:  {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Payments_settings;
}
