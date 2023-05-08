const createError = require("http-errors");
const db = require("../models/index.js");
// const User = db.users;
const PostActivity = db.postActivity;
const Posts = db.posts;
const mongoose = db.mongoose;

exports.getUserProfile = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const user = req.user;

      const posts = await Posts.find({
        author: user._id,
      });

      const upvotes = await PostActivity.find({
        activity_type: "upvotes",
        user_id: user._id,
      });
      const downvote = await PostActivity.find({
        activity_type: "downvotes",
        user_id: user._id,
      });

      res.send({
        status: true,
        message: "profile fetched successfully",
        data: {
          postCount: posts.length,
          upvotes: upvotes.length,
          downvote: downvote.length,
        },
      });
    });
  } catch (err) {
    next(createError(500, err));
  }
};
