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
    attendance: [userID], 
  });

  currentUser.events.push(event._id);
  currentUser.registeredEvents.push(event._id); 
  await currentUser.save();

  res.status(200).json({ message: "Event Created Successfully", event });
});

const getEventsForYou = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const currentUser = await User.findById(currentUserId);
  const currentDate = new Date();

  // Get all upcoming events
  const events = await Event.find({ date: { $gte: currentDate } })
    .populate("createdBy", "fullName userName profilePicture department")
    .populate("attendance", "fullName userName profilePicture")
    .sort({ createdAt: -1 });

  if (!events.length) {
    return res.status(200).json({ events: [] });
  }

  
  const scoredEvents = events.map((event) => {
    const eventObj = event.toObject();
    let relevanceScore = 0;

    
    if (
      event.eventType === "department" &&
      event.organizer === currentUser.department
    ) {
      relevanceScore += 100;
    }

   
    if (
      event.eventType === "club" &&
      currentUser.clubs.includes(event.organizer)
    ) {
      relevanceScore += 75;
    }

    
    const friendsAttending = event.attendance.filter((attendee) =>
      currentUser.friends.includes(attendee._id)
    );
    relevanceScore += Math.min(friendsAttending.length * 10, 50);

   
    relevanceScore += Math.min(event.attendance.length * 2, 25);

    
    const daysUntilEvent = Math.floor(
      (new Date(event.date) - currentDate) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilEvent <= 7) {
      relevanceScore += 50;
    } else if (daysUntilEvent <= 30) {
      relevanceScore += 25;
    }

    return {
      ...eventObj,
      attendees: friendsAttending,
      totalAttendees: event.attendance.length,
      friendsCount: friendsAttending.length,
      isCreator: event.createdBy._id.toString() === currentUserId.toString(),
      relevanceScore,
    };
  });

 
  scoredEvents.sort((a, b) => b.relevanceScore - a.relevanceScore);

  res.json({ events: scoredEvents });
});

const registerEvent = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const currentUser = await User.findById(userId);
  const eventId = req.params.id;
  const event = await Event.findById(eventId).populate(
    "attendance",
    "fullName userName profilePicture"
  );

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

  // Populate the updated event
  const updatedEvent = await Event.findById(eventId)
    .populate("createdBy", "fullName userName profilePicture department")
    .populate("attendance", "fullName userName profilePicture");

  res.json({
    message: "Registered successfully to the event",
    event: updatedEvent,
  });
});

const getAllEvents = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const currentUser = await User.findById(currentUserId).select("friends");
  const currentDate = new Date();

  const events = await Event.find({ date: { $gte: currentDate } })
    .populate("createdBy", "fullName userName profilePicture department")
    .populate("attendance", "fullName userName profilePicture")
    .sort({ createdAt: -1 });

  if (!events.length) {
    return res.status(200).json({ events: [] });
  }

  const transformedEvents = events.map((event) => {
    const eventObj = event.toObject();
    const isCreator =
      eventObj.createdBy._id.toString() === currentUserId.toString();

    if (isCreator) {
      return {
        ...eventObj,
        attendees: eventObj.attendance,
        totalAttendees: eventObj.attendance.length,
        isCreator: true,
      };
    }

    const friendsAttending = eventObj.attendance.filter((attendee) =>
      currentUser.friends.includes(attendee._id)
    );

    return {
      ...eventObj,
      attendees: friendsAttending,
      totalAttendees: eventObj.attendance.length,
      friendsCount: friendsAttending.length,
      isCreator: false,
    };
  });

  res.json({ events: transformedEvents });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const events = await Event.find({ createdBy: userId })
    .populate("createdBy", "fullName userName profilePicture department")
    .populate("attendance", "fullName userName profilePicture")
    .sort({ createdAt: -1 });

  if (!events.length) {
    return res.status(200).json({ events: [] });
  }

  const transformedEvents = events.map((event) => {
    const eventObj = event.toObject();
    return {
      ...eventObj,
      attendees: eventObj.attendance,
      totalAttendees: eventObj.attendance.length,
      isCreator: true,
      isPastEvent: new Date(event.date) < new Date(),
    };
  });

  res.json({ events: transformedEvents });
});

const getRegisteredEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const currentUser = await User.findById(userId).select(
    "friends registeredEvents"
  );
  const currentDate = new Date();

  if (!currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const events = await Event.find({
    _id: { $in: currentUser.registeredEvents },
    date: { $gte: currentDate },
  })
    .populate("createdBy", "fullName userName profilePicture department")
    .populate("attendance", "fullName userName profilePicture")
    .sort({ createdAt: -1 });

  const transformedEvents = events.map((event) => {
    const eventObj = event.toObject();
    const isCreator = eventObj.createdBy._id.toString() === userId.toString();

    if (isCreator) {
      return {
        ...eventObj,
        attendees: eventObj.attendance,
        totalAttendees: eventObj.attendance.length,
        isCreator: true,
      };
    }

    const friendsAttending = eventObj.attendance.filter((attendee) =>
      currentUser.friends.includes(attendee._id)
    );

    return {
      ...eventObj,
      attendees: friendsAttending,
      totalAttendees: eventObj.attendance.length,
      friendsCount: friendsAttending.length,
      isCreator: false,
    };
  });

  res.status(200).json({ events: transformedEvents });
});

const getFeedEvents = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const user = await User.findById(currentUserId).select("friends");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const events = await Event.find({
    $or: [{ createdBy: currentUserId }, { createdBy: { $in: user.friends } }],
  })
    .populate("createdBy", "fullName userName profilePicture department")
    .populate("attendance", "fullName userName profilePicture")
    .sort({ createdAt: -1 });

  const transformedEvents = events.map((event) => {
    const eventObj = event.toObject();
    const isCreator =
      eventObj.createdBy._id.toString() === currentUserId.toString();

    if (isCreator) {
      return {
        ...eventObj,
        attendees: eventObj.attendance,
        totalAttendees: eventObj.attendance.length,
        isCreator: true,
      };
    }

    const friendsAttending = eventObj.attendance.filter((attendee) =>
      user.friends.includes(attendee._id)
    );

    return {
      ...eventObj,
      attendees: friendsAttending,
      totalAttendees: eventObj.attendance.length,
      friendsCount: friendsAttending.length,
      isCreator: false,
    };
  });

  res.status(200).json({ events: transformedEvents });
});

const getEventById = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const currentUserId = req.user._id;
  const currentUser = await User.findById(currentUserId).select("friends");

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400);
    throw new Error("Invalid event ID");
  }

  const event = await Event.findById(eventId)
    .populate("createdBy", "fullName userName profilePicture department")
    .populate("attendance", "fullName userName profilePicture");

  if (!event) {
    res.status(404);
    throw new Error("Event not found!");
  }

  const eventObj = event.toObject();
  const isCreator =
    eventObj.createdBy._id.toString() === currentUserId.toString();

 const transformedEvent = {
   ...eventObj,
   attendees: isCreator
     ? eventObj.attendance
     : eventObj.attendance.filter((attendee) =>
         currentUser.friends.includes(attendee._id)
       ),
   totalAttendees: eventObj.attendance.length,
   friendsCount: !isCreator
     ? eventObj.attendance.filter((attendee) =>
         currentUser.friends.includes(attendee._id)
       ).length
     : undefined,
   isCreator,
   isRegistered: eventObj.attendance.some(
     (attendee) => attendee._id.toString() === currentUserId.toString()
   ),
   currentUserId: currentUserId, 
 };

  res.status(200).json({ event: transformedEvent });
});

module.exports = {
  createEvent,
  registerEvent,
  getFeedEvents,
  getAllEvents,
  getEventById,
  getMyEvents,
  getRegisteredEvents,
  getEventsForYou
};
