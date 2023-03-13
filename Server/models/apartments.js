const { entries, tenants } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Apartment = sequelize.define("apartments",{
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        entry_id: {
            type: DataTypes.INTEGER,
            references: entries,
            referenceskey: 'id',
            allowNull: false
        },  
        floor: {
            type:DataTypes.INTEGER,
            allowNull: false
        },
        res_tenant_id: {
            type: DataTypes.INTEGER,
            references: tenants,
            referenceskey: 'id'
        },
        description: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        num_of_rooms: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pay_per_month: {
            type: DataTypes.INTEGER
        },
        debt: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false
    });
    return Apartment;
}