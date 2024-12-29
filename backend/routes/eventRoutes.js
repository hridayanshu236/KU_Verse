const express = require("express");
const router = express.Router();
const {createEvent,getAllEvents,getEventById,getMyEvents}= require("../controllers/eventController");
const { isAuth } = require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");

router.route("/createevent").post(isAuth, uploadFile, createEvent);
router.route("/getallevents").get(isAuth, getAllEvents);
router.route("/getevent/:id").get(isAuth, getEventById);
router.route("/getmyevents").get(isAuth, getMyEvents);

module.exports= router;