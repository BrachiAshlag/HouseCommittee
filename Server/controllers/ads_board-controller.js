const Ads_board_dal = require("../dal/ads_board-dal");

const createAds_board = (req, res) => {
    Ads_board_dal.createAds_board(req.body)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
}

const deleteAds_board = (req, res) => {
    const id = req.params.id;
    Ads_board_dal.deleteAds_board(id)
    .then(num => {
        if (num == 1) 
            res.send({
                message: "Ads_board was deleted successfully!"
            });
        else 
        res.send({
            message: `Cannot delete ads_board with id=${id}. Maybe ads_board was not found!`
        });
    })
    .catch(err => {
        res.status(500).send({
        message: "Could not delete ads_board with id=" + id
        });
    });
}

const updateAds_board = (req, res) => {
    console.log("updateAds_board");
    const id=req.params.id;
    Ads_board_dal.updateAds_board(id ,req.body)
    .then(num => {
        if (num == 1) {
          res.send({
            message: "Ads_board was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update ads_board with id=${id}. Maybe ads_board was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating ads_board with id=" + id
        });
      });
}

const getAds_board = (req, res) => {
    const id =req.params.id;
    Ads_board_dal.getAds_boardById(id)
    .then(data=>{
        if (data) 
            res.send(data);
        else
            res.status(404).send({
                message: `Cannot find ads board with id=${id}.`
            });  
    })
    .catch (err=>{
        res.status(500).send({
            message: "Error retrieving Ads_board with id=" + id
        });
    });
}

const getAllAds_boards = (req, res) => {
  if(!req.query.building_id && !req.query.entry_id)
    res.status(404).send("One of the field building_id or entry_id required");
    Ads_board_dal.getAllAds_boards(req.query.building_id, req.query.entry_id)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
}

const deleteAdsBoardsRemoveToday = (req, res) =>{
  Ads_board_dal.deleteAdsBoardsRemoveToday()
    .then(data=>{
      res.status(200).send(data);
    })
    .catch(err=>{
      res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving tutorials."
      });
    })
}

module.exports = {
    createAds_board,
    deleteAds_board,
    updateAds_board,
    getAds_board,
    getAllAds_boards,
    deleteAdsBoardsRemoveToday
}