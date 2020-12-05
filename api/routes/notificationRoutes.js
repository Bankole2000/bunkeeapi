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
router.post(
  '/users/:userId',
  requireUserAuth,
  notificationController.sendNotificationToUser
);
router.delete(
  '/notification/:notificationId',
  notificationController.deleteNotification
);

module.exports = router;
