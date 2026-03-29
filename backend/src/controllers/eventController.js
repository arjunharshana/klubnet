const asyncHandler = require("express-async-handler");
const Event = require("../models/event");
const Club = require("../models/club");

// creating a new event

const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, clubId } = req.body;

  if (!title || !description || !date || !location || !clubId) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const club = await Club.findById(clubId);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  const event = new Event({
    title,
    description,
    date,
    location,
    club: clubId,
    createdBy: req.user._id,
  });

  res.status(201).json(await event.save());
});

const getClubEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ club: req.params.clubId }).sort({
    date: 1,
  });
  res.status(200).json({ success: true, count: events.length, data: events });
});

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ date: { $gte: new Date() } })
    .populate("club", "name image")
    .populate("attendees", "name image")
    .sort({ date: 1 });

  res.status(200).json({ success: true, count: events.length, data: events });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  //checking for admin role
  const club = await Club.findById(event.club);

  const isClubAdmin =
    club.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString(),
    ) || req.user.roles?.includes("superadmin");

  if (!isClubAdmin) {
    res.status(403);
    throw new Error("Only club admins can delete events");
  }

  await event.deleteOne();
  res.status(200).json({ message: "Event deleted successfully" });
});

const joinEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const isAlreadyJoined = event.attendees.some(
    (id) => id.toString() === req.user._id.toString(),
  );

  if (isAlreadyJoined) {
    event.attendees = event.attendees.filter(
      (id) => id.toString() !== req.user._id.toString(),
    );
    await event.save();
    return res
      .status(200)
      .json({ success: true, isJoined: false, data: event });
  }

  event.attendees.push(req.user._id);
  await event.save();
  res.status(200).json({ success: true, isJoined: true, data: event });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  //checking for admin role
  const club = await Club.findById(event.club);

  const isClubAdmin =
    club.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString(),
    ) || req.user.roles?.includes("superadmin");

  if (!isClubAdmin) {
    res.status(403);
    throw new Error("Only club admins can update events");
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.eventId,
    req.body,
    { new: true },
  );
  res.status(200).json({ success: true, data: updatedEvent });
});

const getUserEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    attendees: req.user._id,
    date: { $gte: new Date() },
  })
    .populate("club", "name image")
    .sort({ date: 1 });

  res.status(200).json({ success: true, count: events.length, data: events });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId)
    .populate("club", "name image admins")
    .populate("attendees", "name email image")
    .populate("announcements.postedBy", "name image");

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.status(200).json({ success: true, data: event });
});

const postAnnouncement = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const club = await Club.findById(event.club);
  const isClubAdmin =
    club.admins.some(
      (adminId) => adminId.toString() === req.user._id.toString(),
    ) || req.user.roles?.includes("superadmin");

  if (!isClubAdmin) {
    res.status(403);
    throw new Error("Only club admins can post announcements");
  }

  if (!req.body.text) {
    res.status(400);
    throw new Error("Announcement text is required");
  }

  event.announcements.push({
    text: req.body.text,
    postedBy: req.user._id,
  });

  await event.save();
  res.status(201).json({ success: true, message: "Announcement posted" });
});

module.exports = {
  createEvent,
  getClubEvents,
  getAllEvents,
  deleteEvent,
  joinEvent,
  updateEvent,
  getUserEvents,
  getEventById,
  postAnnouncement,
};
