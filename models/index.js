const dotenv = require("dotenv");
// const { MongoClient } = require("mongodb");
const logger = require("../utils/logger");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

dotenv.config();

// fetch mongodb connection url
const url = process.env.MONGODB_URI;

if (!url) {
  logger.error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
  process.exit(1);
}

// create a new MongoClient
// const client = new MongoClient(url);

const db = {};

db.mongoose = mongoose;
db.url = url;

db.users = require("./User.model.js")(mongoose);
db.otp = require("./OTP.model.js")(mongoose);
db.posts = require("./Post.model.js")(mongoose);
db.comments = require("./Comments.model.js")(mongoose);
db.postActivity = require("./PostActivity.model.js")(mongoose);
db.socketTable = require("./SocketTable.model.js")(mongoose);

module.exports = db;
