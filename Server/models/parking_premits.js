const { tenants } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Parking_permit = sequelize.define("parking_permits",{
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true,
        },
        tenant_id: {
            type: DataTypes.INTEGER,
            references: tenants,
            referenceskey: 'id' ,
            allowNull: false
        }, 
        is_allowed: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        }, {
        timestamps: false
    });
    return Parking_permit;
}