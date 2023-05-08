const express = require("express");
const router = express.Router();

const authController = require("../../controllers/Auth.contoller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");

router.get("/jwt", authController.decodeToken);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/send-reset-password-email", authController.sendResetPasswordMail);

router.post("/reset-password", authController.resetPassword);

// block user --> moderator
router.post(
  "/user/block",
  authMiddleware(["Moderator"]),
  authController.blockUserByModerator
);

module.exports = router;
