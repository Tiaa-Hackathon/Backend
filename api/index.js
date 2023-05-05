const express = require("express");
const router = express.Router();

const authRouter = require("./Auth/index.js");

router.use("/auth", authRouter);

module.exports = router;
