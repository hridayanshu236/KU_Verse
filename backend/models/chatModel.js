const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  
  isGroupChat: {
    type: Boolean,
    default: false,
  },

  messages: [
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        message: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            default: Date.now,
        },
    }

  ],
});

module.exports = mongoose.model("Chat", chatSchema);
