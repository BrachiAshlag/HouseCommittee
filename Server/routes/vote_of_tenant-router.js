const express = require("express");
const vote_of_tenants = require("../controllers/vote_of_tenant-controller.js");

const tenantsVoteRouter = express.Router();

tenantsVoteRouter.route("/")
    .get(vote_of_tenants.getAllTenantVotes)
    .post(vote_of_tenants.createTenantVote);
    
tenantsVoteRouter.route("/:id")
    .get(vote_of_tenants.getTenantVote)
    .delete(vote_of_tenants.deleteTenantVote)
    .put(vote_of_tenants.updateTenantVote);

module.exports = tenantsVoteRouter;