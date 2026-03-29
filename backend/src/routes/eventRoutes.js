const express = require("express");
const router = express.Router();
const {
  createEvent,
  getClubEvents,
  getAllEvents,
  deleteEvent,
  joinEvent,
  updateEvent,
  getUserEvents,
  getEventById,
} = require("../controllers/eventController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", getAllEvents);
router.get("/club/:clubId", getClubEvents);
router.get("/:eventId", getEventById);

router.get("/myevents", authMiddleware, getUserEvents);

router.post("/", authMiddleware, createEvent);

router.delete("/:eventId", authMiddleware, deleteEvent);

router.put("/:eventId/join", authMiddleware, joinEvent);
router.put("/:eventId", authMiddleware, updateEvent);

module.exports = router;
