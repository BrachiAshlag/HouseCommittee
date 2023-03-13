const { buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Votes_types = sequelize.define("votes_types",{
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        positive: {
            type: DataTypes.STRING,
            allowNull: false
        },  
        negative: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        building_id: {
            type: DataTypes.INTEGER,
            references: buildings,
            referenceskey:'id'
        }
    }, {
        timestamps: false
    });
    return Votes_types;
}