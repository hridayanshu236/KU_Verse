const express = require("express");

const {isAuth} =require("../middleware/isAuthenticated");
const {myProfile,friend,unfriend,friendList} = require("../controllers/userControllers");
const router = express.Router();

router.get("/myprofile",isAuth, myProfile);
router.route("/friend/:id").post(isAuth,friend);
router.route("/unfriend/:id").post(isAuth,unfriend);
router.route("/friendlist").get(isAuth,friendList);

module.exports = router;