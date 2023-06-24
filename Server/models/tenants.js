const {apartments} = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Tenant = sequelize.define("tenants",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        birth_date: {
            type: DataTypes.DATE
        },
        email: {
            type:DataTypes.STRING,
            validate: { isEmail: true },
            allowNull: false,
            unique: true
        },
        phone: {
            type:DataTypes.STRING,
            unique: true
        },
        apartment_id: {
            type: DataTypes.INTEGER,
            references: apartments,
            referenceskey: 'id',
            allowNull: false
        },
        is_building_committee: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        car_id:{
            type: DataTypes.INTEGER
        },
        password: {
            type: DataTypes.STRING(45), 
            unique: true,
            allowNull: false
        },
        parking_premit: {
            type: DataTypes.BOOLEAN, 
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Tenant;
}