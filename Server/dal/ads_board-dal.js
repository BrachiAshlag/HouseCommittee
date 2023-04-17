const db = require('../models')
const Ads_board = db.ads_boards;

const createAds_board = async (ads_boardToAdd) => {
    return Ads_board.create(ads_boardToAdd);
}

const deleteAds_board = (id) => {
    return Ads_board.destroy({
        where: { id: id }
      })
}

const updateAds_board = (id, Ads_boardToUpdate) => {
    return Ads_board.update(Ads_boardToUpdate, {
        where: { id: id }
      })
}

const getAds_boardById = async (id) => {
    const x = await Ads_board.findByPk(id);
    return x;
}

const getAllAds_boards = async(building_id, entry_id) => {
    if(building_id != undefined)
        return await Ads_board.findAll({ where: { building_id: building_id } });
           
    if(entry_id != undefined)
        return await Ads_board.findAll({ where: { entry_id: entry_id } });
}

const deleteAdsBoardsRemoveToday = () => {
    var today = new Date()
    today.setHours(0,0,0,0);
    return Ads_board.findAll({
        // where:{
        //     removal_date: today 
        // }
        where: db.sequelize.literal("datediff(NOW(), removal_date) = 0")
    })
}

module.exports = {
    createAds_board,
    deleteAds_board,
    updateAds_board,
    getAds_boardById,
    getAllAds_boards,
    deleteAdsBoardsRemoveToday
}