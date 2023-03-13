const { apartments } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Storage = sequelize.define("storages", {
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        apartment_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references:apartments,
            referenceskey: 'id',
            allowNull: false
        },
        description:{
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        } 
    }, {
        timestamps: false
    });
    return Storage;
}