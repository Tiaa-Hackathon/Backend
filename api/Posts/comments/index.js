const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../middlewares/auth.middleware.js");
const commentController = require("../../../controllers/Comment.controller.js");

// reply to a comment
router.post(
  "/reply/:id",
  authMiddleware(["User", "Moderator"]),
  commentController.replyToComment
);

module.exports = router;
