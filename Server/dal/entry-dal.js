const db = require('../models')
const Entry = db.entries;

const createEntry = async (EntryToAdd) => {
    return Entry.create(EntryToAdd);
}

const deleteEntry = (id) => {
    return Entry.destroy({
        where: { id: id }
      })
}

const updateEntry = (id, EntryToUpdate) => {
    return Entry.update(EntryToUpdate, {
        where: { id: id }
      })
}

const getEntryById = (id) => {
    return Entry.findByPk(id);
}


const getAllEntries = () => {
    return Entry.findAll({});
}

module.exports = {
    createEntry,
    deleteEntry,
    updateEntry,
    getEntryById,
    getAllEntries
}