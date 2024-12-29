const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const getDataURI = require("../utilities/generateURL");
const cloudinary = require("../utilities/cloudinary");
const mongoose = require("mongoose");

const createEvent = asyncHandler(async (req, res) => {
  const { eventName, description, duration, date, eventType, organizer } =
    req.body;

  const userID = req.user._id;
  const currentUser = await User.findById(userID);
  let cloudData = null;
  if (req.file) {
    console.log("Processing file upload");
    try {
      const fileURI = getDataURI(req.file);
      if (!fileURI || !fileURI.content) {
        throw new Error("Failed to process uploaded file");
      }
      cloudData = await cloudinary.uploader.upload(fileURI.content);
      console.log("File uploaded to Cloudinary successfully");
    } catch (error) {
      console.error("File upload error:", error);
      return res.status(500).json({
        message: "Error uploading profile picture",
        error: error.message,
      });
    }
  }

  const event = await Event.create({
    eventName,
    description,
    duration,
    date,
    eventType,
    organizer,
    createdBy: userID,
    photo: cloudData?.secure_url,
  });

  currentUser.events.push(event._id);
  await currentUser.save();

  res.status(200).json({ message: "Event Created Successfully", event });
});

const registerEvent = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const currentUser = await User.findById(userId);
  const eventId = req.params.id;
  const event = await Event.findById(eventId);

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400);
    throw new Error("Invalid event ID");
  }
  if (!event) {
    res.status(404);
    throw new Error("No events found");
  }
  if (event.createdBy.toString() === userId.toString()) {
    res.status(403);
    throw new Error("Cannot participate in your own event!");
  }
  if (currentUser.registeredEvents.includes(eventId)) {
    res.status(400);
    throw new Error("Already registered to the event.");
  }

  event.attendance.push(userId);
  currentUser.registeredEvents.push(eventId);

  await event.save();
  await currentUser.save();

  res.json({ message: "Registered succesfully to the event", event });
});

const getFeedEvents = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const user = await User.findById(currentUserId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const friendsIds = user.friends;
  console.log(friendsIds);

  const events = await Event.find({
    $or: [
      { createdBy: currentUserId }, 
      { createdBy: { $in: friendsIds } }, 
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json({events});
});

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find()
    .populate("createdBy", "fullName userName profilePicture department")
    .sort({ createdAt: -1 });

  if (events.length <= 0) {
    res.status(404);
    throw new Error("No events found!");
  }

  res.json({ events });
});

const getEventById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const events = await Event.find({ createdBy: userId })
    .populate("createdBy", "fullName userName profilePicture department")
    .sort({ createdAt: -1 });

  if (events.length <= 0) {
    res.status(404);
    throw new Error("No events found!");
  }

  res.status(200).json({ events });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const events = await Event.find({ createdBy: userId })
    .populate("createdBy", "fullName userName profilePicture department")
    .sort({ createdAt: -1 });

  if (events.length <= 0) {
    res.status(404);
    throw new Error("No events found!");
  }

  res.json({ events });
});

module.exports = {
  createEvent,
  registerEvent,
  getFeedEvents,
  getAllEvents,
  getEventById,
  getMyEvents,
};
