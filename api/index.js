const express = require("express");
const router = express.Router();

const authRouter = require("./Auth/index.js");
const postRouter = require("./Posts/index.js");

router.use("/auth", authRouter);
router.use("/post", postRouter);

module.exports = router;
