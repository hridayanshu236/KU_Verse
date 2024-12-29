const mongoose = require("mongoose");
const Event = require("./eventModel");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dateofBirth: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://www.gravatar.com/avatar/?d=mp",
  },

  department: {
    type: String,
    required: true,
  },
  clubs: {
    type: [String],
  },
  portfolio: {
    type: String,
  },
  bio: {
    type: String,
  },
  skills: {
    type: [String],
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  events:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    }
  ],
  isVerified:{
    type:Boolean,
    default:false
  },
  verificationToken:String,
  verificationTokenExpiresAt: Date,
});

module.exports = mongoose.model("User", userSchema);
