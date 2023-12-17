const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// const { chats } = require("./data/data");
// const { connect } = require("mongoose");
const connectDB = require("./config/db");

const app = express();
dotenv.config();

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// -----------------Deployment------------------

const __dirname1 = path.resolve();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is RUNNING");
  });
}

// -----------------Deployment------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
console.log(process.env.PORT);
const server = app.listen(3001, console.log(`Server started on port:${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 600000,
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room:", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // socket.off("setup", () => {
  //   console.log("User disconnected");
  //   socket.leave(userData._id);
  // });
});
