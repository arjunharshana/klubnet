const Club = require("../models/club");
const User = require("../models/user");
const asynchandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

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

const getClubs = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const clubs = await Club.find(query)
      .populate("admin", "username email")
      .populate("members", "username email")
      .populate("followers", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(clubs);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ message: "Server error while fetching clubs." });
  }
};

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

module.exports = {
  createClub,
  getAllClubs,
  getClubs,
  deleteClub,
};
