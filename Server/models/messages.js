const { buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Faults = sequelize.define("messages", {
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        subtitle: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        creation_date: {
            type: DataTypes.DATE
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