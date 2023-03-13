const Entry_dal = require("../dal/entry-dal");
const Building_dal = require("../dal/building-dal");

const createEntry = (req, res) => {
    Entry_dal.createEntry(req.body)
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

const deleteEntry = (req, res) => {
    const id = req.params.id;
    Entry_dal.deleteEntry(id)
    .then(num => {
        if (num == 1) 
            res.send({
                message: "Entry was deleted successfully!"
            });
        else 
        res.send({
            message: `Cannot delete entry with id=${id}. Maybe entry was not found!`
        });
    })
    .catch(err => {
        res.status(500).send({
        message: "Could not delete entry with id=" + id
        });
    });
}

const updateEntry = (req, res) => {
    const id=req.params.id;
    Entry_dal.updateEntry(id ,req.body)
    .then(num => {
        if (num == 1) {
          res.send({
            message: "Entry was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Entry with id=${id}. Maybe Entry was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Entry with id=" + id
        });
      });
}

const getEntry = (req, res) => {
    const id =req.params.id;
    Entry_dal.getEntryById(id)
    .then(data=>{
        if (data) 
            res.send(data);
        else
            res.status(404).send({
                message: `Cannot find entry with id=${id}.`
            });  
    })
    .catch (err=>{
        res.status(500).send({
            message: "Error retrieving Entry with id=" + id
        });
    });

}

const getAllEntries = async(req, res) => {
    if(!req.query.building_id)
        res.status(404).send("The field building_id required");
    var response = [];
    try{
        const entries = await Entry_dal.getAllEntries();
        if(entries){
            for (let i = 0; i < entries.length; i++) {
                const element = entries[i]; 
                const building = await Building_dal.getBuildingById(element.building_id); 
                if(building){
                    if(building.id == req.query.building_id)
                            response.push(element.dataValues);
                }
                else
                res.status(404).send({
                    message: `Cannot find building between ${req.body.startDate} and ${req.body.endDate}.`
                });
            }
            res.send(response);
        }
        else
        res.status(404).send({
            message: `Cannot find entries between ${req.body.startDate} and ${req.body.endDate}.`
        });
    }
    catch(err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tenants."
        });
    };
}

module.exports = {
    createEntry,
    deleteEntry,
    updateEntry,
    getEntry,
    getAllEntries
}