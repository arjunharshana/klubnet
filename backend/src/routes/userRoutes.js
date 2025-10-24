const express = require("express");

const {
  registerUser,
  loginUser,
  verifyOTP,
  getUserProfile,
  logoutUser,
} = require("../controllers/userController");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify-otp", verifyOTP);

router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
