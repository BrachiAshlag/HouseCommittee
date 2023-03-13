const { votes, tenants } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const VoteOfTenant = sequelize.define("vote_of_tenants",{
        id: {
            type: DataTypes.INTEGER,
            autoIncriment: true,
            primaryKey: true
        },
        vote_id:{
            type: DataTypes.INTEGER,
            references: votes,
            referenceskey: 'id',
            allowNull: false
        },
        tenant_id:{
            type: DataTypes.INTEGER,
            references: tenants,
            referenceskey: 'id',
            allowNull: false
        }, 
        answer: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false
    });
    return VoteOfTenant;
}