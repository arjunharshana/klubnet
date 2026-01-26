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

  //checking for admin role
  if (club.admin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only club admins can create events");
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
  if (club.admin.toString() !== req.user._id.toString()) {
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
  if (event.attendees.includes(req.user._id)) {
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
  if (club.admin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only club admins can update events");
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.eventId,
    req.body,
    { new: true },
  );
  res.status(200).json({ success: true, data: updatedEvent });
}


module.exports = {
  createEvent,
  getClubEvents,
  getAllEvents,
  deleteEvent,
  joinEvent,
};
