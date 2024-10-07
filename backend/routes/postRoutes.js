const express = require("express");
const router = express.Router();
const{createPost,deletePost,getAllPosts,upVote,downVote,commentPost} = require("../controllers/postController");
const {isAuth} =require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");

router.route("/createpost").post(isAuth,uploadFile, createPost);
router.route("/deletepost/:id").delete(isAuth, deletePost);
router.route("/posts").get(isAuth, getAllPosts);
router.route("/upvote/:id").post(isAuth, upVote);
router.route("/downvote/:id").post(isAuth, downVote);
router.route("/comment/:id").post(isAuth, commentPost);


module.exports = router;