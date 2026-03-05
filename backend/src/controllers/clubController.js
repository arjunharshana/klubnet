const Club = require("../models/club");
const User = require("../models/user");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { createNotification } = require("./notificationController");
const asyncHandler = require("express-async-handler");

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
        fs.unlinkSync(req.file.path);
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
      admins: [adminId],
      members: [],
      isApproved: false,
    });

    res.status(201).json({
      message: "Club created successfully! Pending approval by the superadmin",
      data: club,
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
    let query = { isApproved: true };

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
      .populate("admins", "name email image")
      .populate("members", "name email image")
      .populate("followers", "name email image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: clubs,
      count: clubs.length,
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ message: "Server error while fetching clubs." });
  }
};

const leaveClub = async (req, res) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  const isMember = club.members.some((id) => id.toString() === req.user.id);
  const isAdmin = club.admins.some((id) => id.toString() === req.user.id);

  if (!isMember && !isAdmin) {
    res.status(400);
    throw new Error("You are not a part of this club");
  }

  if (isAdmin) {
    if (club.admins.length <= 1) {
      res.status(400);
      throw new Error(
        "You are the last admin. You must promote someone else to admin before leaving.",
      );
    }
    club.admins = club.admins.filter((id) => id.toString() !== req.user.id);
  } else {
    club.members = club.members.filter((id) => id.toString() !== req.user.id);
  }

  await club.save();

  res.status(200).json({ success: true, message: "You have left the club" });
};

const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: "Club not found." });
    }

    const isRequesterAdmin =
      club.admins.some((id) => id.toString() === req.user.id) ||
      req.user.roles?.includes("superadmin");

    if (!isRequesterAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this club." });
    }

    await club.deleteOne();
    res.status(200).json({ message: "Club deleted successfully." });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).json({ message: "Server error while deleting club." });
  }
};

const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("admins", "name email image")
      .populate("members", "name email image")
      .populate("joinRequests", "name email image")
      .populate("followers", "name email image");

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({ success: true, data: club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//superadmin functions
const getPendingClubs = asyncHandler(async (req, res) => {
  const clubs = await Club.find({ isApproved: false }).populate(
    "admins",
    "name email image",
  );
  res.status(200).json({ success: true, data: clubs });
});

const approveClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  club.isApproved = true;
  await club.save();

  // FIX: Notify all Admins of the club
  for (const adminId of club.admins) {
    await createNotification(
      adminId,
      `Great news! Your club "${club.name}" has been approved.`,
      "info",
      `/clubs/${club._id}`,
    );
  }

  res.status(200).json({ success: true, data: club });
});

const rejectClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  for (const adminId of club.admins) {
    await createNotification(
      adminId,
      `We regret to inform you that your club "${club.name}" has been rejected.`,
      "alert",
    );
  }

  await club.deleteOne();
  res.status(200).json({ success: true, message: "Club rejected" });
});

const getSystemStats = asyncHandler(async (req, res) => {
  try {
    const [totalClubs, totalUsers, pendingClubs] = await Promise.all([
      Club.countDocuments({ isApproved: true }),
      User.countDocuments({}),
      Club.countDocuments({ isApproved: false }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalClubs,
        totalUsers,
        pendingClubs,
      },
    });
  } catch (error) {
    console.error("Error fetching system stats:", error);
    res.status(500).json({ message: "Server error while fetching stats." });
  }
});

const followClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  if (!club.followers.includes(req.user.id)) {
    club.followers.push(req.user.id);
    await club.save();
  }

  res.status(200).json({ success: true, data: club.followers });
});

const unfollowClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);

  if (club) {
    club.followers = club.followers.filter(
      (id) => id.toString() !== req.user.id,
    );
    await club.save();
    res.status(200).json({ success: true, data: club.followers });
  } else {
    res.status(404);
    throw new Error("Club not found");
  }
});

const joinRequestClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  if (club.members.includes(req.user.id) || club.admins.includes(req.user.id)) {
    return res
      .status(400)
      .json({ message: "You are already a part of this club" });
  }
  if (club.joinRequests.includes(req.user.id)) {
    return res.status(400).json({ message: "Request already sent" });
  }

  club.joinRequests.push(req.user.id);

  if (!club.followers.includes(req.user.id)) {
    club.followers.push(req.user.id);
  }

  await club.save();
  res.status(200).json({ success: true, message: "Request sent successfully" });
});

const acceptRequest = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  const userIdToApprove = req.params.userId;

  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  const isRequesterAdmin =
    club.admins.some((id) => id.toString() === req.user.id) ||
    req.user.roles?.includes("superadmin");
  if (!isRequesterAdmin) {
    res.status(401);
    throw new Error("Not authorized to manage this club");
  }

  if (!club.joinRequests.includes(userIdToApprove)) {
    return res.status(400).json({ message: "No request found for this user" });
  }

  club.joinRequests = club.joinRequests.filter(
    (id) => id.toString() !== userIdToApprove,
  );
  club.members.push(userIdToApprove);

  await club.save();
  res.status(200).json({ success: true, message: "User accepted into club" });
});

const rejectRequest = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  const userIdToReject = req.params.userId;
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  // FIX: Permissions check
  const isRequesterAdmin =
    club.admins.some((id) => id.toString() === req.user.id) ||
    req.user.roles?.includes("superadmin");
  if (!isRequesterAdmin) {
    res.status(401);
    throw new Error("Not authorized");
  }

  club.joinRequests = club.joinRequests.filter(
    (id) => id.toString() !== userIdToReject,
  );
  await club.save();

  res.status(200).json({ success: true, message: "Request rejected" });
});

const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const isRequesterAdmin =
      club.admins.some((id) => id.toString() === req.user.id) ||
      req.user.roles?.includes("superadmin");
    if (!isRequesterAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this club" });
    }

    club.name = req.body.name || club.name;
    club.category = req.body.category || club.category;
    club.description = req.body.description || club.description;

    if (req.file) {
      try {
        const cloudinary = require("../config/cloudinary");
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "klubnet/clubs",
          width: 800,
          crop: "scale",
        });
        club.image = result.secure_url;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return res.status(500).json({ message: "Failed to upload new image" });
      }
    }

    const updatedClub = await club.save();

    res.status(200).json({
      success: true,
      message: "Club updated successfully",
      data: updatedClub,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating club" });
  }
};

const removeMember = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const isRequesterAdmin =
      club.admins.some((id) => id.toString() === req.user.id) ||
      req.user.roles?.includes("superadmin");
    if (!isRequesterAdmin) {
      return res
        .status(403)
        .json({ message: "Only an admin can remove members" });
    }

    if (club.admins.some((id) => id.toString() === req.params.userId)) {
      return res.status(400).json({
        message: "Cannot remove an admin. Demote them to a member first.",
      });
    }

    club.members = club.members.filter(
      (memberId) => memberId.toString() !== req.params.userId,
    );

    await club.save();
    res
      .status(200)
      .json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error removing member" });
  }
};

const promoteToAdmin = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const isRequesterAdmin =
      club.admins.some((id) => id.toString() === req.user.id) ||
      req.user.roles?.includes("superadmin");
    if (!isRequesterAdmin)
      return res.status(403).json({ message: "Not authorized" });

    const targetUserId = req.params.userId;

    if (!club.members.includes(targetUserId)) {
      return res.status(400).json({ message: "User must be a member first." });
    }

    if (club.admins.includes(targetUserId)) {
      return res.status(400).json({ message: "User is already an admin." });
    }

    club.members = club.members.filter((id) => id.toString() !== targetUserId);
    club.admins.push(targetUserId);

    await club.save();
    res.status(200).json({ success: true, message: "Promoted to Admin!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const demoteFromAdmin = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const isRequesterAdmin =
      club.admins.some((id) => id.toString() === req.user.id) ||
      req.user.roles?.includes("superadmin");
    if (!isRequesterAdmin)
      return res.status(403).json({ message: "Not authorized" });

    const targetUserId = req.params.userId;

    if (club.admins.length <= 1) {
      return res
        .status(400)
        .json({ message: "A club must have at least one admin." });
    }

    club.admins = club.admins.filter((id) => id.toString() !== targetUserId);
    if (!club.members.includes(targetUserId)) {
      club.members.push(targetUserId);
    }

    await club.save();
    res.status(200).json({ success: true, message: "Demoted to Member." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  leaveClub,
  deleteClub,
  removeMember,
  getPendingClubs,
  approveClub,
  rejectClub,
  getSystemStats,
  followClub,
  unfollowClub,
  joinRequestClub,
  acceptRequest,
  rejectRequest,
  updateClub,
  promoteToAdmin,
  demoteFromAdmin,
};
