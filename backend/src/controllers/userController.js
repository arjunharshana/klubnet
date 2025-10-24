const User = require("../models/user");
const { generateToken } = require("../utils/generateToken");
const { sendVerificationEmail } = require("../utils/sendEmail");

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const otp = await sendVerificationEmail(name, email);
    user.verificationOTP = otp;
    user.verificationOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for the verification OTP.",
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error(error);
  }
};

// Verifying otp

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (
      user.verificationOTP === otp &&
      user.verificationOTPExpiry > Date.now()
    ) {
      user.isVerified = true;
      user.verificationOTP = undefined;
      user.verificationOTPExpiry = undefined;
      await user.save();

      generateToken(res, user._id);

      res.status(200).json({
        message: "OTP verified successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      });
    } else {
      res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error(error);
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res
          .status(401)
          .json({ message: "Please verify your email before logging in" });
      }

      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error(error);
  }
};

const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out successfully" });
};

const getUserProfile = async (req, res) => {
  const user = req.user;
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  getUserProfile,
  logoutUser,
};
