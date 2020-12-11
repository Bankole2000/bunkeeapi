const { Router } = require('express');
const { config } = require('../../config/setup');
const router = Router();

const { requireUserAuth } = require('../middleware/authMiddleware');

const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getAllNotifications);
router.get(
  '/user/sent',
  requireUserAuth,
  notificationController.getAllUserSentNotifications
);
router.get(
  '/user/recieved',
  requireUserAuth,
  notificationController.getAllUserRecievedNotifications
);
router.patch(
  '/user/recieved',
  requireUserAuth,
  notificationController.markAllAsRead
);
router.delete(
  '/user/recieved',
  requireUserAuth,
  notificationController.clearAllUserRecievedNotifications
);
router.post(
  '/users/:userId',
  requireUserAuth,
  notificationController.sendNotificationToUser
);
router.delete(
  '/notification/:notificationId',
  notificationController.deleteNotification
);

router.patch(
  '/notification/:notificationId',
  requireUserAuth,
  notificationController.updateNotification
);

module.exports = router;
