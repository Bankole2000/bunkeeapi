const Booking = require('../models/Booking');

module.exports.getAllNotifications = (req, res) => {
  res.status(200).json({ message: 'Get all Notifications is working' });
};

module.exports.getAllUserSentNotifications = (req, res) => {
  res.status(200).json({ message: 'Get all User Sent Notifications' });
};

module.exports.getAllUserRecievedNotifications = (req, res) => {
  res.status(200).json({ message: 'Get all User Recieved Notifications' });
};

module.exports.sendNotificationToUser = (req, res) => {
  res.status(200).json({ message: 'Send Notification to user' });
};

module.exports.deleteNotification = (req, res) => {
  res.status(200).json({ message: 'Delete Notification by Id' });
};
