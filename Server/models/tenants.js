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
            allowNull: false
        },
        phone: {
            type:DataTypes.STRING
        },
        apartment_id: {
            type: DataTypes.INTEGER,
            references: apartments,
            referenceskey: 'id',
            allowNull: false
        },
        Is_building_comittee: {
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
        }
    }, {
        timestamps: false
    });
    return Tenant;
}