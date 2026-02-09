const express = require("express");

const {
  registerUser,
  loginUser,
  verifyOTP,
  getUserProfile,
  logoutUser,
  resendOTP,
  forgotPassword,
  resetPassword,
  updateUserProfile,
} = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
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
  validateEmail,
  validatePasswordReset,
} = require("../middleware/validatorMiddleware");

const router = express.Router();

router.post("/register", validateRegistration, authRateLimiter, registerUser);

router.post("/login", validateLogin, authRateLimiter, loginUser);

router.post("/verify-otp", validateOTP, authRateLimiter, verifyOTP);

router.post("/resend-otp", validateResendOTP, otpRateLimiter, resendOTP);

router.post("/forgot-password", validateEmail, authRateLimiter, forgotPassword);
router.put(
  "/profile",
  authMiddleware,
  upload.single("image"),
  updateUserProfile,
);

router.post(
  "/reset-password",
  validatePasswordReset,
  authRateLimiter,
  resetPassword,
);

router.get("/profile", authMiddleware, rateLimiter, getUserProfile);
router.post("/logout", rateLimiter, logoutUser);

module.exports = router;
