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

module.exports = { createEvent };
