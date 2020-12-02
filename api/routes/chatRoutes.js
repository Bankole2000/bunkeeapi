const { Router } = require('express');
const { config } = require('../../config/setup');
const router = Router();

const { requireUserAuth } = require('../middleware/authMiddleware');

const chatController = require('../controllers/chatController');

router.get('/contacts', requireUserAuth, chatController.getUserContacts);
router.get('/invites', chatController.getAllInvites);
router.get(
  '/contacts/:contactId/messages',
  requireUserAuth,
  chatController.getUserMessagesWithChattee
);
router.post(
  '/contacts/:contactId/messages',
  requireUserAuth,
  chatController.sendMessageToContact
);
router.post(
  '/invites/:chatteeId',
  requireUserAuth,
  chatController.sendChatInvite
);
router.post(
  '/contacts/:contactId/ping/:recieverId',
  requireUserAuth,
  chatController.pingInvitee
);
router.patch(
  '/invites/:inviteId',
  requireUserAuth,
  chatController.respondToChatInvite
);
router.delete(
  '/invites/:inviteId',
  requireUserAuth,
  chatController.deleteChatInvite
);

module.exports = router;
