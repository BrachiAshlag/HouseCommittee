const express = require("express");
const admin = require("../controllers/admin-controller");

const AdminRouter = express.Router();

AdminRouter.route("/")
    .get(admin.getAllAdmins)
    .post(admin.createAdmin);

AdminRouter.route("/:id")
    .get(admin.getAdminById)
    .delete(admin.deleteAdmin);

module.exports = AdminRouter;