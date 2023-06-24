const Vote_dal = require("../dal/vote-dal");
const TenantVote_dal = require("../dal/vote_of_tenant-dal");
const Ads_board_dal = require("../dal/ads_board-dal");
const createVote = (req, res) => {
    Vote_dal.createVote(req.body)
        .then(data => {
            const ad = {
                subject: req.body.subject,
                description: "הצבעה חדשה ממתינה עבורך",
                removal_date: req.body.end_date,
                entry_id: req.body.entry_id,
                building_id: req.body.building_id
            };
            Ads_board_dal.createAds_board(ad)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the vote."
                    });
                })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the vote."
            });
        });
}

const deleteVote = (req, res) => {
    Vote_dal.deleteVote(req.params.id)
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "vote was deleted successfully!"
                });
            }
            else {
                res.status(404).send({
                    message: `Cannot delete vote with id=${req.params.id}. Maybe vote was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete vote with id=" + req.params.id
            });
        });
}

const updateVote = (req, res) => {
    const id = req.params.id;
    Vote_dal.updateVote(id, req.body)
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "vote was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update vote with id=${id}. Maybe expense was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating vote with id=" + id
            });
        });
}

const getVote = async (req, res) => {
    Vote_dal.getVote(req.params.id)
        .then(data => {
            if (data)
                res.send(data);
            else {
                res.status(404).send({
                    message: `Cannot find vote with id=${req.params.id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving vote with id=" + req.params.id
            });
        })
}

const getAllVotes = (req, res) => {
    if (!req.query.building_id && !req.query.entry_id)
        res.status(404).send("One of the fields building_id and entry_id required!!");
    Vote_dal.getAllVotes(req.query.entry_id, req.query.building_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving votes."
            });
        });
}

const getVotesByYear = (req, res) => {
    if ((!req.query.building_id && !req.query.entry_id) || !req.query.year)
        res.status(404).send("One of the fields building_id and entry_id required, and also year required!!");
    Vote_dal.getVotesByYear(req.query.year, req.query.entry_id, req.query.building_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving votes."
            });
        });
}

const getVoteByVoteType = (req, res) => {
    if ((!req.query.building_id && !req.query.entry_id) || !req.query.vote_type_id)
        res.status(404).send("One of the fields building_id and entry_id required, and also vote_type_id required!!");
    Vote_dal.getVoteByVoteType(req.query.entry_id, req.query.building_id, req.query.vote_type_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving votes."
            });
        });
}

const getActiveVotions = async (req, res) => {
    if (!req.query.building_id && !req.query.entry_id)
        res.status(404).send("One of the fields building_id and entry_id required!!");
    if (!req.query.tenant_id) {
        Vote_dal.getActiveVotions(req.query.building_id, req.query.entry_id)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving votes."
                });
            });
    }
    else {
        try {
            var response = [];
            var flag = false;
            const votes = await Vote_dal.getActiveVotions(req.query.building_id, req.query.entry_id);
            if (votes) {
                for (let i = 0; i < votes.length; i++) {
                    const element = votes[i];
                    const tenantVotes = await TenantVote_dal.getAllTenantVotes(element.id);
                    flag = false;
                    for (let i = 0; i < tenantVotes.length; i++) {
                        const tenantVote = tenantVotes[i];
                        if (tenantVote.tenant_id == req.query.tenant_id)
                            flag = true;
                    }
                    if (!flag)
                        response.push(element);
                }
            }
            res.send(response);
        }
        catch (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving votes."
            });
        }
    }
}

const getRelevantVote = async (req, res) => {
    console.log("getRelevantVote");
    if (!req.query.building_id && !req.query.entry_id)
        res.status(404).send("One of the fields building_id and entry_id required!!");
    if (!req.query.tenant_id) {
        Vote_dal.getActiveVotions(req.query.building_id, req.query.entry_id)
            .then(data => {
                res.send(data[0]);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving votes."
                });
            });
    }
    else {
        try {

            var flag = false;
            const votes = await Vote_dal.getActiveVotions(req.query.building_id, req.query.entry_id);
            if (votes) {
                for (let i = 0; i < votes.length; i++) {
                    const element = votes[i];
                    const tenantVotes = await TenantVote_dal.getAllTenantVotes(element.id);
                    flag = false;
                    for (let i = 0; i < tenantVotes.length; i++) {
                        const tenantVote = tenantVotes[i];
                        if (tenantVote.tenant_id == req.query.tenant_id)
                            flag = true;
                    }
                    if (!flag){
                        var response = [];
                        response.push(element);
                        return res.send(response);
                    }
                }
            }
            // res.send(response);
        }
        catch (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving votes."
            });
        }
    }
}

const getVotionBetween = (req, res) => {
    if ((!req.query.building_id && !req.query.entry_id) || !req.query.startDate || !req.query.endDate)
        res.status(404).send("One of the fields building_id and entry_id required!!");
    Vote_dal.getVotionBetween(req.query.entry_id, req.query.building_id, new Date(req.query.startDate), new Date(req.query.endDate))
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving votes."
            });
        });
}

const getLastVote = (req, res) => {
    if (!req.query.building_id && !req.query.entry_id)
        res.status(404).send("One of the fields building_id and entry_id required!!");
    Vote_dal.getLastVote(req.query.building_id, req.query.entry_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving votes."
            });
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
