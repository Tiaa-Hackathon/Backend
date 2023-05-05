const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.users;

module.exports = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (token) {
      let tokenData;
      try {
        tokenData = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return next(createError(401, "Invalid Token"));
      }
      if (tokenData) {
        const user = await User.findOne({ email: tokenData.email });

        if (user) {
          req.user = user;
          next();
        } else {
          next(createError(401, "Unauthorized"));
        }
      } else {
        next(createError(401, "Unauthorized"));
      }
    } else {
      next(createError(401, "Unauthorized"));
    }
  } catch (err) {
    next(createError(500, "Internal server error"));
    console.log(err);
  }
};
