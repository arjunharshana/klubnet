const express = require("express");
const router = express.Router();

const {
  createClub,
  getAllClubs,
  getClubs,
  deleteClub,
} = require("../controllers/clubController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { rateLimiter } = require("../middleware/rateLimiter");

router.get("/", getAllClubs);
router.get(":id", getClubs);

router.post("/", authMiddleware, rateLimiter, createClub);
router.delete("/:id", authMiddleware, deleteClub);

module.exports = router;
