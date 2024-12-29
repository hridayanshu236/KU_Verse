const mongoose = require("mongoose");
const Comment = require("./commentModel");
const User = require("./userModel");

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
  caption: {
    type: String,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  commentt: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  time: {
    type: Date,
    default: Date.now,
  },
});

postSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    const postComments = await Comment.find({ post: this._id });

    for (const comment of postComments) {
      await User.updateOne(
        { _id: comment.user },
        { $pull: { comments: comment._id } }
      );

      await Comment.deleteOne({ _id: comment._id });
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Post", postSchema);
