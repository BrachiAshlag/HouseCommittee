const TenantVote_dal = require("../dal/vote_of_tenant-dal");

const createTenantVote = (req, res) => {  
    TenantVote_dal.createTenantVote(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the tenant_vote."
          });
    });
}

const deleteTenantVote = (req, res) => {
    TenantVote_dal.deleteTenantVote(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "tenant_vote was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete tenant_vote with id=${req.params.id}. Maybe tenant_vote was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete tenant_vote with id=" + req.params.id
        });
    });

}

const updateTenantVote = (req, res) => {
    const id=req.params.id;
    TenantVote_dal.updateTenantVote(id ,req.body)
    .then(num => {
        if (num == 1) {
          res.send({
            message: "tenant_vote was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update tenant_vote with id=${id}. Maybe expense was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating tenant_vote with id=" + id
        });
      });
}

const getTenantVote = async (req, res) => {
    TenantVote_dal.getTenantVote(req.params.id)
    .then(data => {
        if (data) 
            res.send(data);
        else {
            res.status(404).send({
                message: `Cannot find tenant_vote with id=${req.params.id}.`
            });
        }
    })
    .catch(err=>{
        res.status(500).send({
            message: "Error retrieving tenant_vote with id=" + req.params.id
        });
    })    
}

const getAllTenantVotes = (req, res) => {
    TenantVote_dal.getAllTenantVotes(req.query.vote_id)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tenants_votes."
            });
        });
}


module.exports = {
    createTenantVote,
    deleteTenantVote,
    updateTenantVote,
    getTenantVote,
    getAllTenantVotes
}
