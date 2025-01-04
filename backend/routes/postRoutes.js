const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/postController");
const { isAuth } = require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");

router.route("/createpost").post(isAuth, uploadFile, createPost);
router.route("/deletepost/:id").delete(isAuth, deletePost);
router.route("/editpost/:id").put(isAuth,uploadFile ,editPost);
router.route("/posts").get(isAuth, getAllPosts);
router.route("/friendposts/:id").get(isAuth, getPostsById);
router.route("/myposts").get(isAuth, getPost);
router.route("/feedposts").get(isAuth, getFeedPosts);
router.route("/upvote/:id").post(isAuth, upVote);
router.route("/downvote/:id").post(isAuth, downVote);
router.route("/comment/:id").post(isAuth, commentPost);
router.route("/deletecomment/:id").delete(isAuth, deleteComment);
router.route("/updatecaption/:id").put(isAuth, editCaption);
router.put("/editcaption/:id", editCaption);
router.route("/:id/comments").get(isAuth, getCommentsByPostId);
module.exports = router;
