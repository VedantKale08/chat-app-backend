const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes.js");
const path = require("path");

dotenv.config();
const port = "3001" || process.env.PORT;

app.use(cors());
app.use(express.json());

const users = [{}];

connectDB();

app.use("/api/", userRoutes);
app.use("/api/", chatRoutes);
app.use("/api/message", messageRoutes);

const server = app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin:
      process.env.NODE_ENV !== "production"
        ? "http://localhost:3000"
        : "https://chat-app-frontend-1-seven.vercel.app/",
  },
});

console.log("_______________env => "+process.env.NODE_ENV);

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User Joined " + userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room : " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (message) => {
    
    console.log("_______________message => " + message);

    var chat = message.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === message?.sender?._id) return;
      socket.in(user._id).emit("message received", message);
    console.log("_______________message recieved => " + message);
    });
  });

  socket.off("setup", (userData) => {
    console.log("socket disconnected");
    socket.leave(userData._id);
  });
});
