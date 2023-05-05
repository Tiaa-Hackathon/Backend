const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const apis = require("../api/index.js");

const app = express();

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send({ status: true, message: "Server is up" });
});

app.use("/api", apis);

app.use("*", (req, res) => {
  res.status(400).send({ status: false, message: "Not Found" });
});

module.exports = app;
