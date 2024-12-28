const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/post", require("./routes/postRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

app.use(errorHandler);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Define routes
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io Setup
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // React app URL
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Setup user room
  socket.on("setup", (userId) => {
    console.log(`User ${userId} has joined their user room.`);
    socket.join(userId);
  });

  // User joins chat room
  socket.on("join chat", (chatId) => {
    console.log(`User joined chat room: ${chatId}`);
    socket.join(chatId);
  });

socket.on("new message", (messageData) => {
  console.log("Server received new message:", messageData);
  // Make sure all necessary data is included in the emission
  const messageToSend = {
    _id: messageData._id,
    message: messageData.message,
    sender: {
      _id: messageData.sender._id,
      fullName: messageData.sender.fullName,
    },
    time: messageData.time,
    chatId: messageData.chatId,
  };

  // Emit to all clients in the chat room
  io.in(messageData.chatId).emit("message received", messageToSend);
});

  // Typing event
socket.on("typing", ({ chatId, userId, userName }) => {
  console.log(`${userName} is typing in chat: ${chatId}`);
  socket.to(chatId).emit("typing", { chatId, userId, userName }); // Include chatId
});

socket.on("stop typing", ({ chatId, userId, userName }) => {
  console.log(`${userName} stopped typing in chat: ${chatId}`);
  socket.to(chatId).emit("stop typing", { chatId, userId, userName }); // Include chatId
});


  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
