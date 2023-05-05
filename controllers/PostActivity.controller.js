const createError = require("http-errors");
const countCharacters = require("../validators/CharacterCount.js");
const db = require("../models/index.js");
const Post = db.posts;
const PostActivity = db.postActivity;
const Comment = db.comments;
const mongoose = db.mongoose;

exports.createActivity = async (req, res, next) => {
  try {
    const { post_id, activity_type } = req.body;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      if (post_id && activity_type) {
        let post;
        try {
          post = await Post.findById(new mongoose.Types.ObjectId(post_id));
        } catch (err) {
          next(createError(400, "Invalid post id"));
        }

        if (post) {
          if (post.author.toString() !== req.user._id.toString()) {
            switch (activity_type) {
              case "upvote": {
                const activity = await PostActivity.findOne({
                  post_id: post_id,
                  user_id: req.user._id,
                  activity_type: "upvote",
                });
                if (activity) {
                  await PostActivity.deleteOne({ _id: activity._id });
                  return res.send({
                    status: true,
                    message: "Successfully removed upvote",
                  });
                } else {
                  const newActivity = new PostActivity({
                    post_id: post_id,
                    user_id: req.user._id,
                    activity_type: "upvote",
                  });
                  await newActivity.save({ session });
                  return res.send({
                    status: true,
                    message: "Successfully upvoted",
                  });
                }
              }

              case "downvote": {
                const activity = await PostActivity.findOne({
                  post_id: post_id,
                  user_id: req.user._id,
                  activity_type: "downvote",
                });
                if (activity) {
                  await PostActivity.deleteOne({ _id: activity._id });
                  return res.send({
                    status: true,
                    message: "Successfully removed downvote",
                  });
                } else {
                  const newActivity = new PostActivity({
                    post_id: post_id,
                    user_id: req.user._id,
                    activity_type: "downvote",
                  });
                  await newActivity.save({ session });
                  return res.send({
                    status: true,
                    message: "Successfully downvoted",
                  });
                }
              }

              case "comment": {
                const { comment } = req.body;
                if (comment && comment.trim().length > 0) {
                  const newComment = new Comment({
                    text: comment,
                    author: req.user._id,
                  });

                  await newComment.save({ session });

                  post.comments.push(newComment._id);
                  await post.save({ session });

                  return res.send({
                    status: true,
                    message: "Successfully commented",
                  });
                } else {
                  return next(createError(400, "Comment cannot be empty"));
                }
              }

              default: {
                return next(createError(400, "Invalid activity type"));
              }
            }
          } else {
            next(
              createError(400, "You cannot vote or comment on your own post")
            );
          }
        } else {
          next(createError(404, "Post not found"));
        }
      } else {
        next(createError(400, "Post id and activity type are required"));
      }
    });
  } catch (err) {
    next(createError(500, err));
  }
};
