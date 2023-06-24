const db = require('../models/index')
const messages = db.messages;

const createMessage = async (messageToAdd) => {  
    return await messages.create(messageToAdd);
}

const deleteMessage = async (id) => {
    return await messages.destroy({
      where: { id: id }
    })
}

const getAllMessages = async (building_id) => {
    return await messages.findAll({ where: { building_id: building_id } });
}
module.exports = {
    createMessage,
    deleteMessage,
    getAllMessages
}