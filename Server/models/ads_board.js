const { entries, buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Ads_board = sequelize.define('ads_boards',{
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        removal_date: {
            type: DataTypes.DATE,
            allowNull: false
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