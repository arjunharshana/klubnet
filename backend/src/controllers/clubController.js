const Club = require("../models/club");
const User = require("../models/user");
const asynchandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { createNotification } = require("./notificationController");

const createClub = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const adminId = req.user.id;

    if (!name || !description || !category) {
      return res
        .status(400)
        .json({ message: "Name, description, and category are required." });
    }

    let imageUrl = "";

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "klubnet/clubs",
          use_filename: true,
        });
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path); // Delete the file from local uploads folder
      } catch (error) {
        res.status(500);
        throw new Error("Image upload failed");
      }
    }

    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res
        .status(400)
        .json({ message: "Club with this name already exists." });
    }

    const club = await Club.create({
      name,
      description,
      category,
      image: imageUrl,
      admin: adminId,
      members: [adminId],
    });

    res.status(201).json({
      message: "Club created successfully",
    });
  } catch (error) {
    console.error("Error creating club:", error);
    res.status(500).json({ message: "Server error while creating club." });
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const getAllClubs = async (req, res) => {
  try {
    let query = {};

    if (req.query.search) {
      const searchString = String(req.query.search);
      const regex = new RegExp(escapeRegex(searchString), "gi");

      query = {
        ...query,
        $or: [{ name: regex }, { description: regex }],
      };
    }

    if (req.query.category && req.query.category !== "All") {
      query.category = String(req.query.category);
    }

    const clubs = await Club.find(query)
      .populate("admin", "username email")
      .populate("members", "username email")
      .populate("followers", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: clubs,
      count: clubs.Length,
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ message: "Server error while fetching clubs." });
  }
};

const joinClub = asynchandler(async (req, res) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  // Check if user is already a member
  if (club.members.includes(req.user.id)) {
    //leave logic
    club.members = club.members.filter(
      (memberId) => memberId.toString() !== req.user.id,
    );
    await club.save();
    return res.status(200).json({ success: true, data: club });
  } else {
    // join logic
    club.members.push(req.user.id);
    await club.save();

    //notify club admin
    if (club.admin.toString() !== req.user.id) {
      await createNotification(
        club.admin,
        `${req.user.name} joined your club "${club.name}"`,
        "club_join",
        `/clubs/${club._id}`,
      );
    }

    res.status(200).json({ success: true, data: club }); // User joined
  }
});

const deleteClub = async (req, res) => {
  try {
    const clubId = await Club.findById(req.params.id);
    if (!clubId) {
      return res.status(404).json({ message: "Club not found." });
    }

    //check ownership of the club
    if (clubId.admin.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this club." });
    }

    await clubId.deleteOne();
    res.status(200).json({ message: "Club deleted successfully." });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).json({ message: "Server error while deleting club." });
  }
};

const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("admin", "name email image")
      .populate("members", "name email image");

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({ success: true, data: club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  joinClub,
  deleteClub,
};
