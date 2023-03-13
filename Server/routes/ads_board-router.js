
const express = require("express");
const ads_board = require("../controllers/ads_board-controller");

const Ads_boardRouter = express.Router();

Ads_boardRouter.route("/")
    .get(ads_board.getAllAds_boards)
    .post(ads_board.createAds_board)
    
Ads_boardRouter.route("/today")
    .get(ads_board.deleteAdsBoardsRemoveToday); 
    
Ads_boardRouter.route("/:id")
    .get(ads_board.getAds_board)
    .delete(ads_board.deleteAds_board) 
    .put(ads_board.updateAds_board); 
module.exports = Ads_boardRouter;