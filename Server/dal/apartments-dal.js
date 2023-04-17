const db = require('../models/index')
const Apartment = db.apartments;
const { Op } = require('sequelize');
const { sequelize } = require('../models/index');

const createApartment = async (apartmentToAdd) => {
    return await Apartment.create(apartmentToAdd);
}

const deleteApartment = async (id) => {
    return await Apartment.destroy({
        where: { id: id }
    });
}

const updateApartment = async (id, apartmentToUpdate) => {
    return await Apartment.update(apartmentToUpdate, {
        where: { id: id }
    });
}

const getApartment = async (id) => {
    return await Apartment.findByPk(id);
}

const getAllApartments = async () => {
    return await Apartment.findAll({});
}

const getApartmentToUpdateDebt = async () => {
    return await Apartment.findAll({
        // attributes: ["id", "debt", "pay_per_month", "res_tenant_id", "entry_id"],
        include: [
            {
                model: db.entries,
                // attributes: ["id"],
                include:
                {
                    model: db.buildings,
                    // attributes: ["id"],
                    include: {
                        model: db.payments_settings,
                        // attributes: ["next_payment"]
                    }
                }
            },
            {
                model: db.tenants,
                attributes: ["name", "email"]
            }
        ],
        where: db.sequelize.literal("DATEDIFF(next_payment, NOW())=0")
    })
}

const getWeekToPayApartment = async () => {
    return await Apartment.findAll({
        // attributes: ["id", "pay_per_month"],
        include: [
            {
                model: db.entries,
                // attributes: ["id"],
                include:
                {
                    model: db.buildings,
                    // attributes: ["id"],
                    include: {
                        model: db.payments_settings,
                        // attributes: ["next_payment"],

                    }
                }
            },
            {
                model: db.tenants,
                attributes: ["name", "email"],
            }
        ],
        where: db.sequelize.literal("DATEDIFF(next_payment, NOW())=7")
    })
}



module.exports = {
    createApartment,
    deleteApartment,
    updateApartment,
    getApartment,
    getAllApartments,
    getApartmentToUpdateDebt,
    getWeekToPayApartment,
}