const express = require("express");
const messages = require("../controllers/messages-controller");

const messagesRouter = express.Router();

messagesRouter.route("/")
    .get(messages.getAllMessages)
    .post(messages.createMessage);

messagesRouter.route("/:id")
    .delete(messages.deleteMessage);

module.exports = messagesRouter;
 