const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  createClub,
  getAllClubs,
  joinClub,
  getClubById,
  deleteClub,
} = require("../controllers/clubController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { rateLimiter } = require("../middleware/rateLimiter");

router.get("/", getAllClubs);
router.get("/:id", getClubById);
router.put("/:id/join", authMiddleware, joinClub);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  rateLimiter,
  createClub,
);
router.delete("/:id", authMiddleware, deleteClub);

module.exports = router;
