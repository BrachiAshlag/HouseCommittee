const { buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Entries = sequelize.define("entries",{
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        building_id: {
            type: DataTypes.INTEGER,
            references: buildings,
            referencesKey: 'id', 
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        num_of_apartment: {
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        num_of_floors: {
            type: DataTypes.INTEGER, 
            allowNull: false
        },    
    }, {
        timestamps: false
    });
    return Entries;
}
