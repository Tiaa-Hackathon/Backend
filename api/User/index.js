const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware.js");
const profileController = require("../../controllers/Profile.controller.js");

router.get(
  "/profile",
  authMiddleware(["User", "Moderator"]),
  profileController.getUserProfile
);

module.exports = router;
