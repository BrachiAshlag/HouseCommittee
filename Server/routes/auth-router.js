const express = require('express')
const AuthRouter = express.Router()
const auth = require("../controllers/auth-controller");

AuthRouter.post('/register', auth.register);
AuthRouter.get('/adminLogin', auth.adminLogin);
AuthRouter.get('/tenantLogin', auth.tenantLogin);
AuthRouter.put('/forgetPassword', auth.forgetPassword);

module.exports = AuthRouter
