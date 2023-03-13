const { buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Faults = sequelize.define("faults", {
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        building_id: {
            type: DataTypes.INTEGER,
            references: buildings,
            referenceskey: 'id', 
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Faults;
}