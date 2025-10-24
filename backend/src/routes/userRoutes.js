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

const {
  validateRegistration,
  validateLogin,
  validateOTP,
  validateResendOTP,
} = require("../middleware/validatorMiddleware");

const router = express.Router();

router.post("/register", validateRegistration, authRateLimiter, registerUser);

router.post("/login", validateLogin, authRateLimiter, loginUser);

router.post("/verify-otp", validateOTP, authRateLimiter, verifyOTP);

router.post("/resend-otp", validateResendOTP, otpRateLimiter, resendOTP);

router.get("/profile", authMiddleware, rateLimiter, getUserProfile);
router.post("/logout", rateLimiter, logoutUser);

module.exports = router;
