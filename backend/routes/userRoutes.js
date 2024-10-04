const express = require("express");
const jwt = require("jsonwebtoken");
const {isAuth} =require("../middleware/isAuthenticated");
const {myProfile} = require("../controllers/userControllers");
const router = express.Router();

router.get("/myprofile",isAuth, myProfile);

module.exports = router;