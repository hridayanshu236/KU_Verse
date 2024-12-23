const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const getDataURI = require("../utilities/generateURL");
const cloudinary = require("../utilities/cloudinary");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const mongoose = require("mongoose");

const createPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const userID = req.user._id;
  const currentUser = await User.findById(userID);
  const file = req.file;

  const fileURI = getDataURI(file);
  const cloudData = await cloudinary.uploader.upload(fileURI.content);

  const post = await Post.create({
    user: userID,
    caption,
    image: {
      public_id: cloudData.public_id,
      url: cloudData.secure_url,
    },
  });

  currentUser.posts.push(post._id);
  await currentUser.save();

  res.status(201).json({ message: "Post created successfully", post });
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!post) {
    res.status(404);
    throw new Error("No Post found");
  }

  if (post.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  // Corrected Cloudinary Deletion
  await cloudinary.uploader.destroy(post.image.public_id);

  const deletePostId = currentUser.posts.indexOf(post._id);
  if (deletePostId !== -1) {
    currentUser.posts.splice(deletePostId, 1);
  }

  await post.deleteOne();
  await currentUser.save();

  res.status(200).json({ message: "Post deleted successfully" });
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("user", "fullName userName profilePicture")
    .sort({ createdAt: -1 });

  res.json({ posts });
});

const getPostsById = asyncHandler(async (req, res) => {
  const friendId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    res.status(400);
    throw new Error("Invalid friend ID");
  }

  const posts = await Post.find({ user: friendId })
    .populate("user", "fullName userName profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({ posts, success: true });
});

const getPost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const posts = await Post.find({ user: userId })
    .populate("user", "fullName userName profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({ posts, success: true });
});

const getFeedPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("friends");

  const friendsId = user?.friends.map((friend) => friend._id);

  const posts = await Post.find({
    $or: [{ user: userId }, { user: { $in: friendsId } }],
  })
    .populate("user", "fullName userName profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({ posts, success: true });
});

const upVote = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("No post found");
  }

  if (post.upvotes.includes(req.user._id)) {
    res.status(403);
    throw new Error("Post already upvoted");
  }

  // Remove from downvotes if present
  if (post.downvotes.includes(req.user._id)) {
    const indexDownvote = post.downvotes.indexOf(req.user._id);
    post.downvotes.splice(indexDownvote, 1);
  }

  post.upvotes.push(req.user._id);

  const updatedPost = await post.save();
  res.status(200).json(updatedPost); // Return full updated post
});

const downVote = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("No post found");
  }

  if (post.downvotes.includes(req.user._id)) {
    res.status(403);
    throw new Error("Post already downvoted");
  }

  // Remove from upvotes if present
  if (post.upvotes.includes(req.user._id)) {
    const indexUpvote = post.upvotes.indexOf(req.user._id);
    post.upvotes.splice(indexUpvote, 1);
  }

  post.downvotes.push(req.user._id);

  const updatedPost = await post.save();
  res.status(200).json(updatedPost); // Return full updated post
});

const commentPost = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const post = await Post.findById(req.params.id);
  const userId = req.user._id;

  if (!post) {
    res.status(404);
    throw new Error("No post found");
  }

  const newComment = await Comment.create({
    user: userId,
    post: post._id,
    comment,
  });

  post.commentt.push(newComment._id);
  await post.save();

  res.status(200).json({ message: "Comment added successfully" });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  const post = await Post.findById(req.params.id);
  const comment = await Comment.findById(commentId);

  if (!post || !comment) {
    res.status(404);
    throw new Error("Post or Comment not found");
  }

  if (
    post.user.toString() === req.user._id.toString() ||
    comment.user.toString() === req.user._id.toString()
  ) {
    await comment.deleteOne();
    post.commentt.pull(commentId);
    await post.save();
  } else {
    res.status(401);
    throw new Error("Unauthorized");
  }

  res.status(200).json({ message: "Comment deleted successfully" });
});

const editCaption = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  const { newCaption } = req.body;

  if (!post) {
    res.status(404);
    throw new Error("No post found");
  }
  if (post.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  post.caption = newCaption;
  await post.save();
  res.status(200).json({ message: "Caption updated successfully" });
});

module.exports = {
  createPost,
  deletePost,
  getAllPosts,
  getPostsById,
  getPost,
  getFeedPosts,
  upVote,
  downVote,
  commentPost,
  deleteComment,
  editCaption,
};
