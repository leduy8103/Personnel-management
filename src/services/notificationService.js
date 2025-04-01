const Notification = require('../models/Notification');
const socket = require('../socket'); // Import the socket module

const notificationService = {
  createNotification: async (userId, type, message, link) => {
    const notification = new Notification({
      userId,
      type,
      message,
      link,
    });
    await notification.save();

    // Emit real-time notification
    const io = socket.getIo();
    io.to(userId.toString()).emit('notification', notification);

    return notification;
  },

  getNotificationsByUser: async (userId) => {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return notifications;
  },

  markAsRead: async (notificationId) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.isRead = true;
    await notification.save();
    return notification;
  },
};

module.exports = notificationService;