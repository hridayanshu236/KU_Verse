const asyncHandler = require("express-async-handler");
const Bookmark = require("../models/bookmarkModel");

const createBookmarkGroup = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;

  const group = await Bookmark.create({ user: userId, name });
  res.status(201).json(group);
});

const getBookmarkGroups = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const groups = await Bookmark.find({ user: userId }).sort({
    createdAt: -1,
  });

  res.json(groups);
});

const addPostToGroup = asyncHandler(async (req, res) => {
  const { postId, groupName } = req.body;
  const userId = req.user._id;

  let group = await Bookmark.findOne({ user: userId, name: groupName });

  if (!group) {
    group = await Bookmark.create({
      user: userId,
      name: groupName,
    });
  }

  // Check if post is already in the group
  if (!group.posts.some((p) => p.post.toString() === postId)) {
    group.posts.push({ post: postId });
    await group.save();
  }

  res.json(group);
});

const getGroupPosts = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const group = await Bookmark.findOne({
    _id: groupId,
    user: userId,
  }).populate({
    path: "posts.post",
    populate: {
      path: "user",
      select: "fullName profilePicture",
    },
  });

  if (!group) {
    res.status(404);
    throw new Error("Bookmark group not found");
  }

  const posts = group.posts.map((p) => p.post);
  res.json({ posts });
});

module.exports = {
  createBookmarkGroup,
  getBookmarkGroups,
  addPostToGroup,
  getGroupPosts,
};
