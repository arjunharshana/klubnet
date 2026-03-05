const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Sports",
        "Arts",
        "Tech",
        "Literature",
        "Music",
        "Social",
        "Other",
        "Business",
        "Music",
      ],
    },
    image: {
      type: String,
      default: "https://example.com/default-club-image.png",
    },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    joinRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSOn: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
