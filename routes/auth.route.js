const router = require("express").Router()
const authController = require("./../contollers/auth.controller")

router
    .post("/register-admin", authController.registerAdmin)
    .post("/login-admin", authController.loginAdmin)
    .post("/verify-admin-otp", authController.verifyOTP)

module.exports = router