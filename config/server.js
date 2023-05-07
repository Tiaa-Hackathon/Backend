const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("../models/index.js");
const User = db.users;
const SocketTable = db.socketTable;

dotenv.config();

const io = require("socket.io")(process.env.SOCKET_PORT, {
  cors: {
    origin: "*",
  },
});
const apis = require("../api/index.js");

const app = express();

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

io.on("connect", (socket) => {
  console.log(`user connected: ${socket.id}`);
  let username = null; // Set the username to null initially

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${username}`);
    username = null; // Reset the username
  });

  socket.on("mapUserEmailToSocketId", async ({ email, id }) => {
    // tbd error handling
    try {
      await SocketTable.replaceOne(
        { user_email: email },
        { user_email: email, socket_id: id },
        { upsert: true }
      );
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("dm", async ({ content, to, from }) => {
    try {
      const user = await SocketTable.findOne({ user_email: to });
      socket.to(user?.socket_id).emit("receiveDM", {
        content,
        from,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("leave", (room) => {
    username = null; // Reset the username
    socket.leave(room);
  });

  socket.on("message", (data) => {
    data.username = username; // Add the username to the data
    socket.to(data.room).emit("message", data);
  });

  socket.on("typing", (data) => {
    data.username = username; // Add the username to the data
    socket.to(data.room).emit("typing", data);
  });

  socket.on("stopTyping", (data) => {
    data.username = username; // Add the username to the data
    socket.to(data.room).emit("stopTyping", data);
  });
});

app.get("/", (req, res) => {
  res.send({ status: true, message: "Server is up" });
});

app.use("/api", apis);

app.use("*", (req, res) => {
  res.status(400).send({ status: false, message: "Not Found" });
});

module.exports = app;
