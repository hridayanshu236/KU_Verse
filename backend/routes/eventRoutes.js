const express = require("express");
const router = express.Router();
const {createEvent}= require("../controllers/eventController");
const { isAuth } = require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");

router.route("/createevent").post(isAuth, uploadFile, createEvent);

module.exports= router;