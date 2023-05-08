const express = require("express");
const router = express.Router();

const authRouter = require("./Auth/index.js");
const postRouter = require("./Posts/index.js");
const postActivity = require("./PostActivities/index.js");
const analyticsRouter = require("./Analytics/index.js");
const userRouter = require("./User/index.js");

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/post/activity", postActivity);
router.use("/analytics", analyticsRouter);
router.use("/user", userRouter);

module.exports = router;
