const express = require("express");
const router = express.Router();
const {createEvent,registerEvent,getAllEvents,getEventById,getMyEvents,getFeedEvents}= require("../controllers/eventController");
const { isAuth } = require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");

router.route("/createevent").post(isAuth, uploadFile, createEvent);
router.route("/getallevents").get(isAuth, getAllEvents);
router.route("/getevent/:id").get(isAuth, getEventById);
router.route("/getfeedevents").get(isAuth, getFeedEvents);
router.route("/getmyevents").get(isAuth, getMyEvents);
router.route("/registerevent/:id").post(isAuth, registerEvent);

module.exports= router;