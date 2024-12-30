const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logoutUser,verifyEmail} = require("../controllers/authController");
const {isAuth} = require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");

router.route("/register").post(uploadFile,registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/verifyemail").post(verifyEmail);
router.get("/check-status", isAuth, (req, res) => {
  res.json({ isAuthenticated: true }); 
});
module.exports = router;