const express = require("express");
const tenants = require("../controllers/tenants-controller.js");
const tenantRouter = express.Router();

tenantRouter.route("/")
    .get(tenants.getAllTenants)
    .post(tenants.createTenant);
    
tenantRouter.route("/:id")
    .get(tenants.getTenantById)
    .delete(tenants.deleteTenant)
    .put(tenants.updateTenant);

tenantRouter.route("/allTenant/:id")
    .get(tenants.getAllTenantData);

tenantRouter.route("/byApartment/:id")
    .get(tenants.getTenantByApartmentId);

tenantRouter.route("/byPhone/:phone")
    .get(tenants.getTenantByPhone);

tenantRouter.route("/byName/:Name")
    .get(tenants.getTenantByName);

tenantRouter.route("/parkingPermitIsTrue/:building_id")
    .get(tenants.getTenantWhereParkingPermitIsTrue);

tenantRouter.route("/parkingPermitIsFalse/:building_id")
    .get(tenants.getTenantWhereParkingPermitIsFalse);

tenantRouter.route("/byCarNum/:carNum")
    .get(tenants.getTenantByCarNum);

tenantRouter.route("/sendMsgToManager/:email")
    .post(tenants.postSendMsgToManager);

tenantRouter.route("/changePassword/:tenant_id")
    .put(tenants.changePassword);

module.exports = tenantRouter;