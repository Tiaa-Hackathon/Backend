const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware.js");
const postController = require("../../controllers/Post.controller.js");

// create a new post
router.post("/", authMiddleware, postController.createPost);

// edit a post
router.put("/:id", authMiddleware, postController.editPost);

// get all posts of current user
router.get("/", authMiddleware, postController.getCurrentUserPosts);

// get post by id
router.get("/:id", authMiddleware, postController.getPostById);

// delete a post
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;
