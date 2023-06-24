const db = require('../models/index')
const TenantVote = db.vote_of_tenants;

const createTenantVote = async (voteToAdd) => {  
    return await TenantVote.create(voteToAdd);
}

const deleteTenantVote = async (id) => {
    return await TenantVote.destroy({
      where: { id: id }
    });
}

const updateTenantVote = async (id, voteToUpdate) => {
    return await TenantVote.update(voteToUpdate, {
        where: { id: id }
    });
}

const getTenantVote = async (id) => {
    return await TenantVote.findByPk(id);    
}

const getAllTenantVotes = async (voteId) => {
    console.log("voteId",voteId);
    return await TenantVote.findAll({ where: { vote_id: voteId } });
}



module.exports = {
    createTenantVote,
    deleteTenantVote,
    updateTenantVote,
    getTenantVote,
    getAllTenantVotes
}


