const express = require("express");
const router = express.Router();

const authController = require("../../controllers/Auth.contoller.js");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/send-reset-password-email", authController.sendResetPasswordMail);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
