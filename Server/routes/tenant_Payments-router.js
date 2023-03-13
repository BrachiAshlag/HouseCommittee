const express = require("express");
const tenantPayments =require("../controllers/tenant_payments-controller");

const TenantPaymentsRouter = express.Router();

TenantPaymentsRouter.route("/")
    .get(tenantPayments.getAllTenants_payments)
    .post(tenantPayments.createTenant_payment);
    
TenantPaymentsRouter.route("/:id")
    .get(tenantPayments.getTenant_payment)
    .delete(tenantPayments.deleteTenant_payment)
    .put(tenantPayments.updateTenant_payment);
    
module.exports = TenantPaymentsRouter;

