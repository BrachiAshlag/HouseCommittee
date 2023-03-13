const express = require("express");
const voteTypes = require("../controllers/vote_types-controller");

const voteTypesRouter = express.Router();

voteTypesRouter.route("/")
    .get(voteTypes.getAllVoteTypes)
    .post(voteTypes.createVoteType);

voteTypesRouter.route("/:id")
    .get(voteTypes.getVoteTypeById)
    .delete(voteTypes.deleteVoteType);

module.exports = voteTypesRouter;
 