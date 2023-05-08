const express = require("express");
const router = express.Router();

const analyticsController = require("../../controllers/Analytics.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");

router.get(
  "/",
  authMiddleware(["Moderator"]),
  analyticsController.getAnalytics
);

module.exports = router;
