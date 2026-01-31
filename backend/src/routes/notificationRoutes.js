const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getNotifications);
router.put("/:id/read", authMiddleware, markAsRead);

module.exports = router;
