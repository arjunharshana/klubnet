const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+(edu|ac\.in)$/,
        "Please use a valid educational email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOTP: {
      type: String,
    },
    verificationOTPExpiry: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiry: {
      type: Date,
    },
    roles: {
      type: [String],
      enum: ["user", "admin", "superadmin"],
      default: ["user"],
    },
    image: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxLength: 300,
    },
    major: {
      type: String,
    },
    year: {
      type: String,
    },
    socials: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

// Hash password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isModified("passwordResetToken")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    return next(error);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  //Check if password exists
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpiry = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
