const express = require("express");
const router = express.Router();
const{createPost} = require("../controllers/postController");
const {isAuth} =require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");

router.route("/createpost").post(isAuth,uploadFile, createPost);

module.exports = router;