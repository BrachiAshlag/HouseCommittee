const { entries, buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Ads_board = sequelize.define('ads_boards',{
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        description: DataTypes.STRING,
        removal_date: {
            type: DataTypes.DATE
        },
        entry_id: {
            type:DataTypes.INTEGER,
            references: entries,
            referencesKey: 'id'
        },
        building_id: {
            type:DataTypes.INTEGER,
            references: buildings,
            referencesKey: 'id'
        },
    }, {
        timestamps: 0
    });
    return Ads_board;
}