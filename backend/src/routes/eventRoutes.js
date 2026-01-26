const express = require("express");
const router = express.Router();
const {
  createEvent,
  getClubEvents,
  getAllEvents,
} = require("../controllers/eventController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", getAllEvents);
router.get("/club/:clubId", getClubEvents);

router.post("/", authMiddleware, createEvent);

module.exports = router;
