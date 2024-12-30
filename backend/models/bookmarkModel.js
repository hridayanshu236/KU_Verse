const mongoose = require("mongoose");

const bookmarkGroupSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  posts: [
    {
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bookmark", bookmarkGroupSchema);
