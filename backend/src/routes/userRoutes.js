const express = require("express");

const {
  registerUser,
  loginUser,
  verifyOTP,
  getUserProfile,
  logoutUser,
  resendOTP,
} = require("../controllers/userController");

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  rateLimiter,
  authRateLimiter,
  otpRateLimiter,
} = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", authRateLimiter, registerUser);

router.post("/login", authRateLimiter, loginUser);

router.post("/verify-otp", authRateLimiter, verifyOTP);

router.post("/resend-otp", otpRateLimiter, resendOTP);

router.get("/profile", authMiddleware, rateLimiter, getUserProfile);
router.post("/logout", rateLimiter, logoutUser);

module.exports = router;
