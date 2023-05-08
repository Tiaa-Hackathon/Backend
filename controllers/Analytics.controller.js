const createError = require("http-errors");
const db = require("../models/index.js");
const PostActivity = db.postActivity;
const User = db.users;
const Post = db.posts;
const mongoose = db.mongoose;

exports.getAnalytics = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0); // Set the time to the start of today

      const endOfToday = new Date(startOfToday);
      endOfToday.setDate(endOfToday.getDate() + 1);
      const [user, post, postActivity] = await Promise.all([
        await User.find(
          {
            createdAt: {
              $gte: startOfToday,
              $lt: endOfToday,
            },
          },
          null,
          { session }
        ),
        await Post.find(
          {
            createdAt: {
              $gte: startOfToday,
              $lt: endOfToday,
            },
          },
          null,
          { session }
        ),
        await PostActivity.find(
          {
            createdAt: {
              $gte: startOfToday,
              $lt: endOfToday,
            },
            activity_type: "flag",
          },
          null,
          { session }
        ),
      ]);

      res.send({
        status: true,
        message: "Analytics generated",
        data: {
          userAnalytics: user.length,
          postAnalytics: post.length,
          postActivity: postActivity.length,
        },
      });

      //   await User.findAll(
      //     {
      //       createdAt: new Date(),
      //     },
      //     null,
      //     { session }
      //   );

      //   await Post.findAll(
      //     {
      //       createdAt: new Date(),
      //     },
      //     null,
      //     { session }
      //   );
    });
  } catch (err) {
    next(createError(500, err));
  }
};
