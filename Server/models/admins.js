const { buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Admin = sequelize.define("admins", {
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        building_id: {
            type: DataTypes.INTEGER,
            references: buildings,
            referenceskey: 'id'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
    }, {
        timestamps: false
    });
    return Admin;
}