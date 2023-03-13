const ads_board_dal = require("../dal/ads_board-dal");

const deleteAds = async() => {
    try{
        console.log("deleteAds");
        const ads = await ads_board_dal.deleteAdsBoardsRemoveToday();
        console.log(ads);
        if(ads){
            for (let i = 0; i < ads.length; i++) {
                const element = ads[i];
                await ads_board_dal.deleteAds_board(element.id);
            }
        }
    }
    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while deleting the ad."
        });
    };
}

module.exports = {
    deleteAds
}