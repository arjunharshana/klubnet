const express = require("express");
const router = express.Router();
const {
  createEvent,
  getClubEvents,
  getAllEvents,
  deleteEvent,
  joinEvent,
} = require("../controllers/eventController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", getAllEvents);
router.get("/club/:clubId", getClubEvents);

router.post("/", authMiddleware, createEvent);

router.delete("/:eventId", authMiddleware, deleteEvent);

router.put("/:eventId/join", authMiddleware, joinEvent);

module.exports = router;
