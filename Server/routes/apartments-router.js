const express = require("express");
const apartments = require("../controllers/apartments-controller");

const ApartmentRouter = express.Router();

ApartmentRouter.route("/")
    .get(apartments.getAllApartments)
    .post(apartments.createApartment);

ApartmentRouter.route("/description")
    .get(apartments.getApartmentsDescription);

ApartmentRouter.route("/ByTenant/:id")
    .get(apartments.getApartmentByTenantId);

ApartmentRouter.route("/byName/:name")
    .get(apartments.getApartmentByResTenantName);

ApartmentRouter.route("/byId/:id")
    .get(apartments.getApartmentById)
    .delete(apartments.deleteApartment)
    .put(apartments.updateApartment);

ApartmentRouter.route("/byStorage/:id")
    .get(apartments.getApartmentByStorage)

ApartmentRouter.route("/byPark/:id")
    .get(apartments.getApartmentByPark)

ApartmentRouter.route("/late")
    .get(apartments.getApartmentToUpdateDebt)

ApartmentRouter.route("/inWeek")
    .get(apartments.getWeekToPayApartment)

module.exports = ApartmentRouter;