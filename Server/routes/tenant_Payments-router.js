const express = require("express");
const tenantPayments =require("../controllers/tenant_payments-controller");

const TenantPaymentsRouter = express.Router();

TenantPaymentsRouter.route("/")
    .get(tenantPayments.getTenantsPaymentsRange)
    .post(tenantPayments.createTenant_payment);
    
TenantPaymentsRouter.route("/:id")
    .get(tenantPayments.getTenant_payment)
    .delete(tenantPayments.deleteTenant_payment)
    .put(tenantPayments.updateTenant_payment);

TenantPaymentsRouter.get("/openFile/:id", tenantPayments.openFile);
TenantPaymentsRouter.get("/all/:apartment_id", tenantPayments.getAllTenants_payments);
TenantPaymentsRouter.get("/rangeByApartment/:apartment_id", tenantPayments.getTenantsPaymentsRangeByApartment);

    
module.exports = TenantPaymentsRouter;

