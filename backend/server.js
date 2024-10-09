const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/post", require("./routes/postRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Define routes
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });
  socket.on("send message", (messageData) => {
    console.log("Message received on server:", messageData);
    socket.to(messageData.chatId).emit("message received", messageData);
  });
  socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", socket.id, "Reason:", reason);
});
});
