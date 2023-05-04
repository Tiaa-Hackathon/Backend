const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const logger = require("../utils/logger");

dotenv.config();

const env = process.env.MODE || "development";

// fetch mongodb connection url
const url = process.env.MONGODB_URI;

if (!url) {
  logger.error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
  process.exit(1);
}

// create a new MongoClient
const client = new MongoClient(url);

const db = {};

db.mongodb = client;

module.exports = db;
