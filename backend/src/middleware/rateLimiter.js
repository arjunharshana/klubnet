const { rateLimit } = require("express-rate-limit");

// Apply the rate limiting to all requests
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for auth routes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for OTP verification
const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { rateLimiter, authRateLimiter, otpRateLimiter };
