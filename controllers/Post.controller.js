const createError = require("http-errors");
const countCharacters = require("../validators/CharacterCount.js");
const db = require("../models/index.js");
const Post = db.posts;
const mongoose = db.mongoose;

exports.createPost = async (req, res, next) => {
  try {
    const { title, body } = req.body;

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      if (title && title.length > 0 && body && body.length > 0) {
        if (countCharacters(body) <= 2000) {
          const post = new Post({
            title,
            body,
          });

          post.author = req.user._id;
          post.save({ session });

          res.status(201).send({
            success: true,
            message: "Post created successfully",
          });
        } else {
          next(
            createError(400, "Post content can't be more than 2000 characters")
          );
        }
      } else {
        next(createError(400, "Title and body are required"));
      }
    });
  } catch (err) {
    next(createError(500, err));
  }
};

exports.editPost = async (req, res, next) => {
  try {
    const { title, body = null } = req.body;

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let post;
      try {
        post = await Post.findById(new mongoose.Types.ObjectId(req.params.id));
      } catch (err) {
        return next(createError(400, "Invalid post ID"));
      }

      if (post) {
        if (post.author.equals(req.user._id)) {
          if (title) {
            post.title = title;
          }
          if (body && countCharacters(body) <= 2000) {
            post.body = body;
          }
          post.save({ session });

          res.status(200).send({
            success: true,
            message: "Post updated successfully",
          });
        } else {
          next(createError(403, "You are not authorized to edit this post"));
        }
      } else {
        next(createError(404, "Post not found"));
      }
    });
  } catch (err) {
    next(createError(500, err));
  }
};

exports.getCurrentUserPosts = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const posts = await Post.find(
        {
          author: req.user._id,
        },
        null,
        { session }
      ).sort({ createdAt: -1 });
      res.send({
        success: true,
        message: "Posts fetched successfully",
        data: {
          posts,
        },
      });
    });
  } catch (err) {
    next(createError(500, err));
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let post;
      try {
        post = await Post.findById(
          new mongoose.Types.ObjectId(req.params.id),
          null,
          { session }
        );
      } catch (err) {
        return next(createError(400, "Invalid post ID"));
      }
      res.send({
        success: true,
        message: "Posts fetched successfully",
        data: {
          post,
        },
      });
    });
  } catch (err) {
    next(createError(500, err));
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let post;
      try {
        post = await Post.findById(
          new mongoose.Types.ObjectId(req.params.id),
          null,
          { session }
        );
      } catch (err) {
        return next(createError(400, "Invalid post ID"));
      }

      if (post) {
        if (post.author.equals(req.user._id)) {
          await Post.deleteOne({ _id: post._id }, { session });
          res.status(200).send({
            success: true,
            message: "Post deleted successfully",
          });
        } else {
          next(createError(403, "You are not authorized to delete this post"));
        }
      } else {
        next(createError(404, "Post not found"));
      }
    });
  } catch (err) {
    next(createError(500, err));
  }
};
