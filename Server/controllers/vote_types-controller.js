const Vote_types_dal = require("../dal/vote_types-dal");
const Apartment_dal = require("../dal/apartments-dal");
const Entry_dal = require("../dal/entry-dal");
const Building_dal = require("../dal/building-dal");

const createVoteType = (req, res) => {  
    Vote_types_dal.createVoteType(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the voteTypes."
          });
    });
}

const deleteVoteType = (req, res) => {
    Vote_types_dal.deleteVoteType(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "voteTypes was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete voteTypes with id=${req.params.id}. Maybe voteTypes was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete voteTypes with id=" + req.params.id
        });
    });

}

const getAllVoteTypes = async (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    Vote_types_dal.getAllVoteTypes(req.query.building_id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Votes types."
        });
    });
    // var response = [];
    // try{
    //     const voteTypes = await Vote_types_dal.getAllVoteTypes();
    //     console.log(voteTypes);
    //     for (let i = 0; i < voteTypes.length; i++) {
    //         const element = voteTypes[i];
    //         const building = await Building_dal.getBuildingById(req.query.building_id); 
    //         if(building){
    //             if(building.id == req.query.building_id){
    //                 response.push(element);
    //             }
    //             console.log(response);
    //         }
    //         else res.status(404).send(`Cannot find voteType with building id=${req.query.building_id}.`)    
    //     }
    //     res.send(response);
    // }
    // catch(err){
    //     res.status(500).send({ message: "Some error occurred while retrieving voteTypes."  });
    // }   
}

const getVoteTypeById = async(req, res) =>{
    try{
        const voteType = await Vote_types_dal.getVoteTypeById(req.params.id);
        if(voteType){
            res.send(voteType);
        }
        else res.status(404).send({ message: `Cannot find voteType with id=${req.params.id}.` });
    }
    catch(err){
        res.status(500).send({ message: err.message || "Some error occurred while retrieving voteTypeing." });
    }   
}



module.exports = {
    createVoteType,
    deleteVoteType,
    getAllVoteTypes,
    getVoteTypeById
}
