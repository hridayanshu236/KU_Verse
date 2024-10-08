const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logoutUser} = require("../controllers/authController");
const {isAuth} = require("../middleware/isAuthenticated");
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.get("/check-status", isAuth, (req, res) => {
  res.json({ isAuthenticated: true }); 
});
module.exports = router;