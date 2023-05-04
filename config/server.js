const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const v1 = require("../api/v1/index.js");

const app = express();

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send({ status: true, message: "Server is up" });
});

app.use("/api/v1", v1);

app.use("*", (req, res) => {
  res.status(400).send({ status: false, message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500);
  res.send({
    status: false,
    enviroment: process.env.NODE_ENV || "production",
    message:
      err.status === 403
        ? err.message
        : process.env.NODE_ENV === "development"
        ? err.message
        : "Error Occoured",
  });
});

module.exports = app;
