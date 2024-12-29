const express = require("express");

const {isAuth} =require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");
const {myProfile,updateProfilePicture,getAllUsers,friend,unfriend,friendList,updateProfile,updatePassword, viewUserProfile,getRecommendations, getMutualConnections, getMutualFriends} = require("../controllers/userControllers");
const router = express.Router();

router.get("/myprofile",isAuth, myProfile);
router.get("/profile/:id",isAuth,viewUserProfile)
router.get("/users",isAuth,getAllUsers);
router.route("/friend/:id").post(isAuth,friend);
router.route("/unfriend/:id").post(isAuth,unfriend);
router.route("/friendlist").get(isAuth,friendList);
router.route("/updateprofile").put(isAuth,updateProfile);
router.route("/updatepassword").put(isAuth,updatePassword);
router.route("/updateDp").put(isAuth, uploadFile, updateProfilePicture);
router.get("/recommendations", isAuth, getRecommendations);

router.get('/mutual-connections/:userId', isAuth, getMutualConnections);


router.get('/mutual-friends/:userId', isAuth, getMutualFriends);

module.exports = router;