const messages_dal = require("../dal/messages-dal");

const createMessage = (req, res) => {  
    req.body.creation_date = new Date().toISOString().slice(0, 10);
    messages_dal.createMessage(req.body)
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message:
              err.message || "Some error occurred while creating the messages."
          });
    });
}

const deleteMessage = (req, res) => {
    messages_dal.deleteMessage(req.params.id)
    .then(num => {
        if (num == 1) {
            res.send({
                message: "messages was deleted successfully!"
            });
        } 
        else {
            res.status(404).send({
                message: `Cannot delete messages with id=${req.params.id}. Maybe messages was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete messages with id=" + req.params.id
        });
    });
}

const getAllMessages = (req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    messages_dal.getAllMessages(req.query.building_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving messages."
            });
        });
}

module.exports = {
    createMessage,
    deleteMessage,
    getAllMessages
}
