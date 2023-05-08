const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware.js");
const postController = require("../../controllers/Post.controller.js");
const commentRouter = require("./comments/index.js");

router.use("/comment", authMiddleware(["User", "Moderator"]), commentRouter);

// create a new post
router.post(
  "/",
  authMiddleware(["User", "Moderator"]),
  postController.createPost
);

// edit a post
router.put(
  "/:id",
  authMiddleware(["User", "Moderator"]),
  postController.editPost
);

// get all posts
router.get("/all", postController.getAllPosts);

// get all posts of current user
router.get(
  "/",
  authMiddleware(["User", "Moderator"]),
  postController.getCurrentUserPosts
);

// get post by id
router.get(
  "/:id",
  authMiddleware(["User", "Moderator"]),
  postController.getPostById
);

// delete a post
router.delete(
  "/:id",
  authMiddleware(["User", "Moderator"]),
  postController.deletePost
);

// hide post for all by mods
router.post(
  "/hide/:id",
  authMiddleware(["Moderator"]),
  postController.hidePostForAll
);

module.exports = router;
