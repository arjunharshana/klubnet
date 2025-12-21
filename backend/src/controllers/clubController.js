const Club = require("../models/club");
const User = require("../models/user");

const createClub = async (req, res) => {
  try {
    const { name, description, category, imageUrl } = req.body;
    const adminId = req.user.id;

    if(!name || !description || !category) {
      return res.status(400).json({ message: "Name, description, and category are required." });
    }

    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({ message: "Club with this name already exists." });
    }

    const club = await Club.create({
      name,
      description,
      category,
      imageUrl,
      admin: adminId,
      members: [adminId],
    });

      res.status(201).json(
          {
              message: "Club created successfully",
          });
      } catch (error) {
      console.error("Error creating club:", error);
      res.status(500).json({ message: "Server error while creating club." });
    }
  };
  
  const getClubs = async (req, res) => {
    try {
      const {category, search} = req.query;
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
      const clubId =await Club.findById(req.params.id);
        if (!clubId) {
            return res.status(404).json({ message: "Club not found." });
        }


    //check ownership of the club
    if (clubId.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this club." });
    }

    await clubId.deleteOne();
    res.status(200).json({ message: "Club deleted successfully." });
  }catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).json({ message: "Server error while deleting club." });
  }
};

module.exports = {
  createClub,
  getClubs,
  deleteClub,
};