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
      )
        .sort({ createdAt: -1 })
        .populate({
          path: "author",
          select: "-password",
        })
        .populate({
          path: "comments",
          populate: [
            {
              path: "author",
              select: "-password",
            },
            {
              path: "replies",
              populate: {
                path: "author",
                select: "-password",
              },
            },
          ],
        });
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
        post = await Post.findOne({
          _id: new mongoose.Types.ObjectId(req.params.id),
          isVisible: true,
        })
          .populate({
            path: "author",
            select: "-password",
          })
          .populate({
            path: "comments",
            populate: [
              {
                path: "author",
                select: "-password",
              },
              {
                path: "replies",
                populate: {
                  path: "author",
                  select: "-password",
                },
              },
            ],
          });
      } catch (err) {
        return next(createError(400, "Invalid post ID"));
      }
      if (post) {
        res.send({
          success: true,
          message: "Posts fetched successfully",
          data: {
            post,
          },
        });
      } else {
        next(createError(404, "Post not found"));
      }
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

exports.getAllPosts = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // const posts = await Post.aggregate([
      //   // Left outer join the post activities
      //   {
      //     $lookup: {
      //       from: "posts_activities",
      //       localField: "_id",
      //       foreignField: "post_id",
      //       as: "activities",
      //     },
      //   },
      //   // Unwind the activities array
      //   { $unwind: { path: "$activities", preserveNullAndEmptyArrays: true } },
      //   // Project a flag indicating whether the activity is an upvote
      //   {
      //     $project: {
      //       _id: 1,
      //       title: 1,
      //       body: 1,
      //       author: 1,
      //       comments: 1,
      //       is_upvote: { $eq: ["$activities.activity_type", "upvote"] },
      //     },
      //   },
      //   // Group by the post and count the upvotes
      //   {
      //     $group: {
      //       _id: "$_id",
      //       title: { $first: "$title" },
      //       body: { $first: "$body" },
      //       author: { $first: "$author" },
      //       comments: { $first: "$comments" },
      //       upvotes: {
      //         $sum: { $cond: { if: "$is_upvote", then: 1, else: 0 } },
      //       },
      //     },
      //   },
      //   // Sort by the count of upvotes
      //   { $sort: { upvotes: -1 } },
      // ])
      //   .populate({
      //     path: "author",
      //     select: "-password",
      //   })
      //   .populate({
      //     path: "comments",
      //     populate: [
      //       {
      //         path: "author",
      //         select: "-password",
      //       },
      //       {
      //         path: "replies",
      //         populate: {
      //           path: "author",
      //           select: "-password",
      //         },
      //       },
      //     ],
      //   });

      const posts = await Post.aggregate([
        // Left outer join the post activities
        {
          $lookup: {
            from: "posts_activities",
            localField: "_id",
            foreignField: "post_id",
            as: "activities",
          },
        },
        // Unwind the activities array
        { $unwind: { path: "$activities", preserveNullAndEmptyArrays: true } },
        // Project a flag indicating whether the activity is an upvote
        {
          $project: {
            _id: 1,
            title: 1,
            body: 1,
            author: 1,
            comments: 1,
            is_upvote: { $eq: ["$activities.activity_type", "upvote"] },
            is_downvote: { $eq: ["$activities.activity_type", "downvote"] },
            createdAt: 1,
          },
        },
        // Group by the post and count the upvotes
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            body: { $first: "$body" },
            author: { $first: "$author" },
            comments: { $first: "$comments" },
            upvotes: {
              $sum: { $cond: { if: "$is_upvote", then: 1, else: 0 } },
            },
            downvotes: {
              $sum: { $cond: { if: "$is_downvote", then: 1, else: 0 } },
            },
            createdAt: { $first: "$createdAt" },
            is_upvote: { $first: "$is_upvote" },
            is_downvote: { $first: "$is_downvote" },
          },
        },
        // Join with the users collection to fetch the author's details
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        // Unwind the author array
        { $unwind: "$author" },
        // Sort by the count of upvotes
        { $sort: { upvotes: -1 } },
      ]);

      return res.send({
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

exports.hidePostForAll = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        const post = await Post.findById(
          new mongoose.Types.ObjectId(req.params.id),
          null,
          { session }
        );

        if (post) {
          post.isVisible = false;
          await post.save({ session });

          res.send({
            status: true,
            message: "Post removed for all",
          });
        } else {
          next(createError(404, "Post not found"));
        }
      });
    } else {
      next(createError(400, "Post id not provided"));
    }
  } catch (err) {
    next(createError(500, err));
  }
};
