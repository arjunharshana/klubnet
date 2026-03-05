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
  getSystemStats,
  followClub,
  unfollowClub,
  joinRequestClub,
  acceptRequest,
  rejectRequest,
  updateClub,
  leaveClub,
  removeMember,
  promoteToAdmin,
  demoteFromAdmin,
} = require("../controllers/clubController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { rateLimiter } = require("../middleware/rateLimiter");

router.get("/", getAllClubs);
router.get("/:id", getClubById);
router.put("/:id/leave", authMiddleware, leaveClub);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  rateLimiter,
  createClub,
);

router.delete("/:id", authMiddleware, deleteClub);

router.put("/:id/follow", authMiddleware, followClub);
router.put("/:id/unfollow", authMiddleware, unfollowClub);
router.put("/:id", authMiddleware, upload.single("image"), updateClub);
router.post("/:id/join", authMiddleware, joinRequestClub);
router.delete("/:id/members/:userId", authMiddleware, removeMember);
router.put("/:id/requests/:userId/accept", authMiddleware, acceptRequest);
router.put("/:id/requests/:userId/reject", authMiddleware, rejectRequest);
router.put("/:id/members/:userId/promote", authMiddleware, promoteToAdmin);
router.put("/:id/members/:userId/demote", authMiddleware, demoteFromAdmin);

// Superadmin routes
router.get("/admin/pending", authMiddleware, superAdmin, getPendingClubs);
router.get("/admin/stats", authMiddleware, superAdmin, getSystemStats);
router.put("/:id/approve", authMiddleware, superAdmin, approveClub);
router.delete("/:id/reject", authMiddleware, superAdmin, rejectClub);

module.exports = router;
