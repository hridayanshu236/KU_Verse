const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const createChat = asyncHandler(async (req, res) => {
  const { participants } = req.body;


  if (!participants.includes(req.user._id)) {
    participants.push(req.user._id);
  }

 
  const isGroupChat = participants.length > 2;


  const existingChat = await Chat.findOne({
    participants: { $all: participants },
    isGroupChat: false,
  });

  if (!isGroupChat && existingChat) {
    return res
      .status(400)
      .json({ message: "Chat already exists between these users." });
  }


  const chat = await Chat.create({ participants, isGroupChat });


  await User.updateMany(
    { _id: { $in: participants } },
    { $addToSet: { chats: chat._id } } 
  );

  res.status(201).json(chat);
});

const getUserChats = asyncHandler(async (req, res) => {
  const userId = req.user._id;


  const chats = await Chat.find({ participants: userId })
    .populate("participants", "fullName profilePicture")
    .populate("lastMessage");

  res.json(chats);
});


const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params; 
  const { message } = req.body; 


  const newMessage = await Message.create({
    chat: chatId,
    sender: req.user._id, 
    message,
  });

  // Update the chat with the last message
  await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });


  res.status(201).json(newMessage);
});


const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;


  const messages = await Message.find({ chat: chatId }).populate(
    "sender",
    "userName profilePicture"
  );

  res.json(messages);
});

module.exports = { createChat, getUserChats, sendMessage, getChatMessages };
