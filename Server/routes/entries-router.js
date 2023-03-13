
const express = require("express");
const entries = require("../controllers/entries-controller");

const EntryRouter = express.Router();

EntryRouter.route("/")
    .get(entries.getAllEntries)
    .post(entries.createEntry);  
    
EntryRouter.route("/:id")
    .get(entries.getEntry)
    .delete(entries.deleteEntry)
    .put(entries.updateEntry);  

module.exports = EntryRouter;