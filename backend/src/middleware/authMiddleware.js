const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    next();
  } else {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
};

const superAdmin = (req, res, next) => {
  if (req.user && req.user.roles?.includes("superadmin")) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as superadmin");
  }
};

module.exports = { authMiddleware, superAdmin };
