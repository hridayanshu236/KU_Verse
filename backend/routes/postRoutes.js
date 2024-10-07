const express = require("express");
const router = express.Router();
const{createPost,deletePost,getAllPosts} = require("../controllers/postController");
const {isAuth} =require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");

router.route("/createpost").post(isAuth,uploadFile, createPost);
router.route("/deletepost/:id").delete(isAuth, deletePost);
router.route("/posts").get(isAuth, getAllPosts);

module.exports = router;