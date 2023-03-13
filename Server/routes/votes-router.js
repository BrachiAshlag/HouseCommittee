const express = require("express");
const vote = require("../controllers/votes-controller.js");

const voteRouter = express.Router();

voteRouter.route("/")
    .get(vote.getAllVotes)
    .post(vote.createVote);

voteRouter.route("/active")   
    .get(vote.getActiveVotions);

voteRouter.route("/byDates")   
    .get(vote.getVotionBetween);

voteRouter.route("/byYear")   
    .get(vote.getVotesByYear);

voteRouter.route("/relevant")   
    .get(vote.getRelevantVote);

voteRouter.route("/byVoteType")   
    .get(vote.getVoteByVoteType);

voteRouter.route("/:id")
    .get(vote.getVote)
    .delete(vote.deleteVote)
    .put(vote.updateVote);
    
module.exports = voteRouter;