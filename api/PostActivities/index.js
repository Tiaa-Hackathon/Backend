const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware.js");
const postActivityController = require("../../controllers/PostActivity.controller.js");

// create activity(upvote, downvote, comment) for a post
router.post(
  "/",
  authMiddleware(["User", "Moderator"]),
  postActivityController.createActivity
);

module.exports = router;
