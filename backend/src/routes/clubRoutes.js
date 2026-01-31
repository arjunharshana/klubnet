const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { superAdmin } = require("../middleware/authMiddleware");

const {
  createClub,
  getAllClubs,
  joinClub,
  getClubById,
  deleteClub,
  getPendingClubs,
  approveClub,
  rejectClub,
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

// Superadmin routes
router.get("/admin/pending", authMiddleware, superAdmin, getPendingClubs);
router.put("/:id/approve", authMiddleware, superAdmin, approveClub);
router.delete("/:id/reject", authMiddleware, superAdmin, rejectClub);

module.exports = router;
