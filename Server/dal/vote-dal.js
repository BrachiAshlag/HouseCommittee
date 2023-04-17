const db = require('../models')
const Vote = db.votes;
const { Op } = require("sequelize");

const createVote = async (voteToAdd) => {
    return await Vote.create(voteToAdd);
}

const deleteVote = async (id) => {
    return await Vote.destroy({
        where: { id: id }
    });
}

const updateVote = async (id, voteToUpdate) => {
    return await Vote.update(voteToUpdate, {
        where: { id: id }
    });
}

const getVote = async (id) => {
    return await Vote.findByPk(id);
}

const getAllVotes = async (entry_id, building_id) => {
    if (building_id != undefined)
        return await Vote.findAll({ where: { building_id: building_id } });

    if (entry_id != undefined)
        return Vote.findAll({ where: { entry_id: entry_id } });
}

const getActiveVotions = async (building_id, entry_id) => {
    if (building_id != undefined)
        return await Vote.findAll({
            where: {
                [Op.and]: {
                    end_date: { [Op.gt]: new Date() },
                    building_id: building_id
                }  
            }, 
            order:[['end_date', 'ASC']]
        });
    if (entry_id != undefined)
        return await Vote.findAll({
            where: {
                [Op.and]: {
                    end_date: { [Op.gt]: new Date() },
                    entry_id: entry_id
                }  
            }, 
            order:[['end_date', 'ASC']]
        });
}

const getRelevantVote = async (entry_id, building_id) => {
    if (building_id != undefined)
        return await Vote.findAll({
            limit:1, 
            where: { 
                [Op.and]: {
                    end_date: { 
                        [Op.gt]: new Date() 
                    },
                    building_id: building_id
                }
                
            }, 
            order:[['end_date', 'ASC']]
        });
    if (entry_id != undefined)
        return await Vote.findAll({
            limit:1, 
            where: { 
                [Op.and]: {
                    end_date: { 
                        [Op.gt]: new Date() 
                    },
                    entry_id: entry_id
                }
                
            }, 
            order:[['end_date', 'ASC']]
        });
}

const getLastVote = async (entry_id, building_id) => {
    if (building_id != undefined)
        return await Vote.findAll({
            limit:1, 
            where: { 
                [Op.and]: {
                    end_date: { 
                        [Op.lt]: new Date() 
                    },
                    building_id: building_id
                }
                
            }, 
            order:[['end_date', 'ASC']]
        });
    if (entry_id != undefined)
        return await Vote.findAll({
            limit:1, 
            where: { 
                [Op.and]: {
                    end_date: { 
                        [Op.lt]: new Date() 
                    },
                    entry_id: entry_id
                }
                
            }, 
            order:[['end_date', 'ASC']]
        });
}

const getVotesByYear = (year, entry_id, building_id) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    if (building_id != undefined)
        return Vote.findAll({
            where: {
                [Op.and]: {
                    end_date: {
                        [Op.between]: [startDate, endDate]
                    },
                    building_id: building_id
                }
                
            }
        });

    if (entry_id != undefined)
        return Vote.findAll({
            where: {
                [Op.and]: {
                    end_date: {
                        [Op.between]: [startDate, endDate]
                    },
                    entry_id: entry_id
                }
                
            }
        });
    
}

const getVoteByVoteType = (entry_id, building_id, vote_type_id) => {
    if (building_id != undefined)
        return Vote.findAll({ 
            where:{ 
                [Op.and]: {
                    vote_type_id: vote_type_id ,
                    building_id: building_id 
                }
        }});
    if (entry_id != undefined)
        return Vote.findAll({ 
            where:{ 
                [Op.and]: {
                    vote_type_id: vote_type_id ,
                    entry_id: entry_id 
                }
        }});
}

const getVotionBetween = (entry_id, building_id, startDate, endDate) => {
    if (building_id != undefined)
        return Vote.findAll({
            where: { 
                [Op.and]: {
                    end_date: { [Op.between]: [startDate, endDate] }, 
                    building_id: building_id 
                }
            }
        });
    if (entry_id != undefined)
        return Vote.findAll({
            where: { 
                [Op.and]: {
                    end_date: { [Op.between]: [startDate, endDate] }, 
                    entry_id: entry_id 
                }
            }
        });
}

module.exports = {
    createVote,
    deleteVote,
    updateVote,
    getVote,
    getAllVotes,
    getActiveVotions,
    getVotionBetween,
    getVotesByYear,
    getRelevantVote,
    getVoteByVoteType,
    getLastVote
}