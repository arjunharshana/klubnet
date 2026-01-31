const asynchandler = require("express-async-handler");
const Notification = require("../models/notification");

const getNotifications = asynchandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ data: notifications });
}

const markAsRead = asynchandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error("Notification not found");
    }
    if (notification.recipient.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Not authorized to update this notification");
    }

    notification.isRead = true;
    await notification.save();
    res.status(200).json({ message: "Notification marked as read" });
}  );  

const createNotification = async (recipientId, message, type = "info", link = "") => {
    try{
        await Notification.create({
            recipient: recipientId,
            message,
            type,
            link,
        });
    }catch(error){
        console.error("Error creating notification:", error);
    }
};

module.exports = {
  getNotifications,
  markAsRead,
  createNotification,
};