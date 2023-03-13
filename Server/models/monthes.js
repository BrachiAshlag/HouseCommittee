const { buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Monthes = sequelize.define("monthes", {
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        month: {
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
    return Monthes;
}