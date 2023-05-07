const createError = require("http-errors");
const countCharacters = require("../validators/CharacterCount.js");
const db = require("../models/index.js");
const Post = db.posts;
const mongoose = db.mongoose;

exports.replyToComment = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      res.send({
        status: true,
        message: "Reply to comment route",
      });
    });
  } catch (err) {
    next(createError(500, err));
  }
};
