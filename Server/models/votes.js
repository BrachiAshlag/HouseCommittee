const { votes_types, entries, buildings } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Vote = sequelize.define("votes",{
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        endDate:{
            type:  DataTypes.DATE
        }, 
        vote_type_id:{
            type: DataTypes.INTEGER,
            references: votes_types,
            referenceskey: 'id',
            allowNull: false
        },  
        entry_id:{
            type: DataTypes.INTEGER,
            references: entries,
            referenceskey: 'id'
        },
        building_id:{
            type:  DataTypes.INTEGER,
            references: buildings,
            referenceskey: 'id'
        }
    }, {
        timestamps: false
    });
    return Vote;
}