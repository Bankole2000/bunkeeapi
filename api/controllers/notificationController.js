const { helpers, config } = require('../../config/setup');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { Op } = require('sequelize');

module.exports.getAllNotifications = (req, res) => {
  res.status(200).json({ message: 'Get all Notifications is working' });
};

module.exports.getAllUserSentNotifications = (req, res) => {
  res.status(200).json({ message: 'Get all User Sent Notifications' });
};

module.exports.getAllUserRecievedNotifications = (req, res) => {
  res.status(200).json({ message: 'Get all User Recieved Notifications' });
};

module.exports.sendNotificationToUser = async (req, res) => {
  const { userId } = req;
  const recieverId = req.params.userId;
  try {
    if (userId == recieverId) {
      throw helpers.generateError('Cannot send Notification to self', 'userId');
    }
    const sender = await User.findByPk(userId);
    const reciever = await User.findByPk(recieverId);

    if (sender && reciever) {
      newNotification = await Notification.create({
        notificationType: req.body?.notificationType || 'listingInvite',
        senderId: sender.id,
        recieverId: reciever.id,
        notificationText:
          req.body?.notificationText || `invited you to view a listing`,
        notificationAction: req.body?.notificationAction || '',
        notificationUrl: req.body?.notificationUrl || null,
        associatedUsers: [sender.id, reciever.id],
      });
      const createdNotification = await Notification.findByPk(
        newNotification.id,
        {
          include: [
            { model: User, as: 'sender' },
            { model: User, as: 'reciever' },
          ],
        }
      );

      res.status(201).json({
        message: `Invite Sent`,
        success: true,
        notification: createdNotification,
      });
    } else {
      throw helpers.generateError('Sender/Reciever not found', 'userId');
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }

  res.status(200).json({ message: 'Send Notification to user' });
};

module.exports.deleteNotification = (req, res) => {
  res.status(200).json({ message: 'Delete Notification by Id' });
};

module.exports.updateNotification = async (req, res) => {
  const { userId } = req;
  const { notificationId } = req.params;
  try {
    const notifToUpdate = await Notification.findByPk(notificationId);
    if (notifToUpdate.recieverId == userId) {
      const updateData = {};
      for (const data of req.body) {
        updateData[data.name] = data.value;
      }
      const result = await Notification.update(updateData, {
        where: { id: notifToUpdate.id },
      });
      if (result[0]) {
        const udpatedNotification = await Notification.findByPk(
          notifToUpdate.id,
          {
            include: [
              { model: User, as: 'reciever' },
              { model: User, as: 'sender' },
            ],
          }
        );
        res.status(200).json({
          message: 'Notification updated',
          success: true,
          notification: udpatedNotification,
        });
      } else {
        throw helpers.generateError('Server Error', 'Server Error');
      }
    } else {
      throw helpers.generateError(
        'Notification was not recieved by this user',
        'userId'
      );
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};
