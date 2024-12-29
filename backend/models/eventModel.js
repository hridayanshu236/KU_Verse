const mongoose = require("mongoose");
const User = require("./userModel");

const eventSchema = mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  description:{
    type:String,
    required:true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date:{
    type: Date,
    required:true,
  },
  eventType:{
    type: String,
    required:true,
  },
  organizer:{
    type: String,
    required:true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  attendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  photo: {
    type:String,
  },
});

module.exports = mongoose.model("Event", eventSchema);
