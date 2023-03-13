const db = require('../models/index')
const Votes_types = db.votes_types;

const createVoteType = async (VoteTypeToAdd) => {  
    return await Votes_types.create(VoteTypeToAdd);
}

const deleteVoteType = async (id) => {
    return await Votes_types.destroy({
      where: { id: id }
    })
}

const getAllVoteTypes = async (building_id) => {
    return await Votes_types.findAll({
        where: {
            building_id: building_id
        }
    });
}

const getVoteTypeById = async (id) => {
    return await Votes_types.findByPk(id);
}


module.exports = {
    createVoteType,
    deleteVoteType,
    getAllVoteTypes,
    getVoteTypeById,
}