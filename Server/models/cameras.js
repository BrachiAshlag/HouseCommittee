const { buildings } = require(".");
module.exports = (sequelize, DataTypes)=>{
    const Cameras = sequelize.define("cameras", {
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
            type:DataTypes.INTEGER,
            references: buildings,
            referencesKey: 'id', 
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Cameras;
}
