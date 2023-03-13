const express = require('express')
const AuthRouter = express.Router()
const auth = require("../controllers/auth-controller");

AuthRouter.post('/register', auth.register)
AuthRouter.post('/login', auth.login)
AuthRouter.post('/forgetPassword', auth.forgetPassword)

module.exports = AuthRouter
