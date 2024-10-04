const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuthenticated");
const {
  createChat,
  getUserChats,
  sendMessage,
  getChatMessages,
} = require("../controllers/chatController");


router.post("/create", isAuth, createChat);


router.get("/mychats", isAuth, getUserChats);


router.post("/:chatId/sendMessage", isAuth, sendMessage);


router.get("/:chatId/messages", isAuth, getChatMessages);

module.exports = router;
