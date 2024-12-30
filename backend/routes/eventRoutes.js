const express = require("express");
const router = express.Router();
const {createEvent,registerEvent,getAllEvents,getEventById,getMyEvents,getFeedEvents,getRegisteredEvents,getEventsForYou, searchEvents}= require("../controllers/eventController");
const { isAuth } = require("../middleware/isAuthenticated");
const uploadFile = require("../middleware/multer");

router.route("/createevent").post(isAuth, uploadFile, createEvent);
router.route("/getallevents").get(isAuth, getAllEvents);
router.route("/getevent/:id").get(isAuth, getEventById);
router.route("/getfeedevents").get(isAuth, getFeedEvents);
router.route("/getmyevents").get(isAuth, getMyEvents);
router.route("/registerevent/:id").post(isAuth, registerEvent);
router.route("/searchevents").get(isAuth, searchEvents);
router.route("/getregisteredevents").get(isAuth, getRegisteredEvents);
router.get("/for-you", isAuth, getEventsForYou);
module.exports= router;