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

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
