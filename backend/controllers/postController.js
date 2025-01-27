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
    .populate("user", "fullName userName profilePicture department")
    .sort({ time: -1 });

  console.log(
    `[GetPostsById] Retrieved ${posts.length} posts for user ID: ${friendId}`
  );

  if (posts.length > 0) {
    console.log("[Sample Post Time]:", {
      userName: posts[0].user.userName,
      postTime: posts[0].time,
      currentTime: new Date(),
    });
  }

  res.status(200).json({ posts, success: true });
});

const getPost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const posts = await Post.find({ user: userId })
    .populate("user", "fullName userName profilePicture department")
    .sort({ time: -1 });

  console.log(
    `[GetPost] Retrieved ${posts.length} posts for current user: ${req.user.userName}`
  );

  if (posts.length > 0) {
    console.log("[Sample Post Time]:", {
      userName: posts[0].user.userName,
      postTime: posts[0].time,
      currentTime: new Date(),
    });
  }

  res.status(200).json({ posts, success: true });
});

const getFeedPosts = asyncHandler(async (req, res) => {
  const currentTime = new Date();
  console.log(
    `[Feed Request Started] - User: ${
      req.user.userName
    } - Time: ${currentTime.toISOString()}`
  );

  const userId = req.user._id;
  console.log(`[User ID]: ${userId}`);

  const user = await User.findById(userId).populate("friends");
  const friendsId = user?.friends.map((friend) => friend._id);
  console.log(`[Friends Count]: ${friendsId?.length || 0}`);

  try {
    const posts = await Post.aggregate([
      {
        $match: {
          $or: [
            { user: userId },
            { user: { $in: friendsId } },
            { voteCount: { $gte: 5 } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $addFields: {
          hoursSincePost: {
            $divide: [
              { $subtract: [currentTime, "$time"] },
              1000 * 60 * 60, // Convert to hours
            ],
          },
        },
      },
      {
        $addFields: {
          timeScore: {
            $switch: {
              branches: [
                // Very recent posts (less than 1 hour)
                {
                  case: { $lte: ["$hoursSincePost", 1] },
                  then: {
                    $add: [
                      5, // Highest base score for very recent posts
                      {
                        $multiply: [
                          { $subtract: [1, "$hoursSincePost"] },
                          2, // Additional boost for posts under 1 hour
                        ],
                      },
                    ],
                  },
                },
                // Posts within 24 hours
                {
                  case: { $lte: ["$hoursSincePost", 24] },
                  then: {
                    $add: [
                      3, // Base score for recent posts
                      {
                        $multiply: [
                          {
                            $subtract: [
                              1,
                              { $divide: ["$hoursSincePost", 24] },
                            ],
                          },
                          2,
                        ],
                      },
                    ],
                  },
                },
              ],
              default: {
                $divide: [
                  1,
                  { $add: [1, { $divide: ["$hoursSincePost", 24] }] },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              "$timeScore",
              // Engagement factors with reduced weight
              { $multiply: [{ $size: "$upvotes" }, 0.05] },
              { $multiply: [{ $size: "$commentt" }, 0.1] },
              // Extra boost for user's own recent posts
              {
                $cond: {
                  if: {
                    $and: [
                      { $eq: ["$user", userId] },
                      { $lte: ["$hoursSincePost", 24] },
                    ],
                  },
                  then: 2, // Significant boost for own recent posts
                  else: 0,
                },
              },
              // Friend boost with slightly reduced weight
              {
                $cond: {
                  if: { $in: ["$user", friendsId] },
                  then: 0.3,
                  else: 0,
                },
              },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      {
        $project: {
          _id: 1,
          caption: 1,
          image: 1,
          time: 1,
          upvotes: 1,
          downvotes: 1,
          commentt: 1,
          voteCount: 1,
          score: 1,
          timeScore: 1,
          hoursSincePost: 1,
          user: {
            _id: "$userDetails._id",
            fullName: "$userDetails.fullName",
            userName: "$userDetails.userName",
            profilePicture: "$userDetails.profilePicture",
            department: "$userDetails.department",
          },
        },
      },
    ]);

    console.log(`[Posts Retrieved]: ${posts.length}`);

    if (posts.length > 0) {
      console.log("[Sample Post]:", {
        _id: posts[0]._id,
        time: posts[0].time,
        hoursSincePost: posts[0].hoursSincePost,
        timeScore: posts[0].timeScore,
        finalScore: posts[0].score,
        userName: posts[0].user.userName,
        voteCount: posts[0].voteCount,
      });
    }

    const debugCounts = {
      totalPosts: posts.length,
      veryRecent: posts.filter((p) => p.hoursSincePost <= 1).length,
      last24Hours: posts.filter((p) => p.hoursSincePost <= 24).length,
      userPosts: posts.filter(
        (p) => p.user._id.toString() === userId.toString()
      ).length,
      friendsPosts: posts.filter((p) =>
        friendsId.some((id) => id.toString() === p.user._id.toString())
      ).length,
      highEngagementPosts: posts.filter((p) => p.voteCount >= 5).length,
    };
    console.log("[Debug Counts]:", debugCounts);

    res.status(200).json({
      posts,
      success: true,
      debug: debugCounts,
    });
  } catch (error) {
    console.error("[Feed Error]:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch feed posts",
    });
  }
});
const upVote = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("No post found");
  }

  const userId = req.user._id;
  const hasUpvoted = post.upvotes.includes(userId);
  const hasDownvoted = post.downvotes.includes(userId);

  if (hasUpvoted) {
    post.upvotes = post.upvotes.filter((id) => !id.equals(userId));
    post.voteCount -= 1;
  } else {
    if (hasDownvoted) {
      post.downvotes = post.downvotes.filter((id) => !id.equals(userId));
      post.voteCount += 1;
    }

    post.upvotes.push(userId);
    post.voteCount += 1;
  }

  const updatedPost = await post.save();
  console.log("Current vote count:", updatedPost.voteCount);

  res.status(200).json(updatedPost);
});

const downVote = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("No post found");
  }

  const userId = req.user._id;
  const hasDownvoted = post.downvotes.includes(userId);
  const hasUpvoted = post.upvotes.includes(userId);

  if (hasDownvoted) {
    post.downvotes = post.downvotes.filter((id) => !id.equals(userId));
    post.voteCount += 1;
  } else {
    if (hasUpvoted) {
      post.upvotes = post.upvotes.filter((id) => !id.equals(userId));
      post.voteCount -= 1;
    }

    post.downvotes.push(userId);
    post.voteCount -= 1;
  }

  const updatedPost = await post.save();
  console.log("Current vote count:", updatedPost.voteCount);

  res.status(200).json(updatedPost);
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

  res.status(200).json({
    _id: newComment._id,
    comment: newComment.comment,
    time: newComment.createdAt,
  });
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

const getCommentsByPostId = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("Invalid post ID");
  }

  const post = await Post.findById(postId).populate({
    path: "commentt",
    populate: {
      path: "user",
      select: "fullName userName profilePicture",
    },
  });

  if (!post) {
    res.status(404);
    throw new Error("No post found");
  }

  res.status(200).json({ comments: post.commentt });
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

const editPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { caption } = req.body;
  const post = await Post.findById(postId);
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("Invalid post ID");
  }
  if (!post) {
    res.status(404);
    throw new Error("No post found");
  }

  // Check if the user is the owner of the post
  if (post.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (caption) {
    post.caption = caption;
  }

  const file = req.file;
  // Handle image update
  if (req.file) {
    try {
      // Delete the old image from Cloudinary if it exists
      if (post.image && post.image.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }
      const fileURI = getDataURI(file);

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(fileURI.content);

      post.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      res.status(500);
      throw new Error("Error uploading image: " + error.message);
    }
  }

  if (!caption && !file) {
    res.status(400);
    throw new Error("No valid fields to update");
  }

  // Update the post
  await post.save();

  res.status(200).json({ message: "Post updated succesfully", post: post });
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
  getCommentsByPostId,
  editPost,
};
