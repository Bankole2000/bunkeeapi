const { Router } = require('express');

const router = Router();

const {
  requireUserAuth,
  requireAgentAuth,
  requireUserSelfAuth,
} = require('../middleware/authMiddleware');

const offerController = require('../controllers/offerController');

router.get('/', offerController.getAllOffers);
router.post('/', requireUserAuth, offerController.createAnOffer);
router.post(
  '/:offerId/comments',
  requireUserAuth,
  offerController.addCommentToOffer
);
router.post('/:offerId/like', requireUserAuth, offerController.likeOffer);
router.post(
  '/:offerId/comments/:commentId/like',
  requireUserAuth,
  offerController.likeOfferComment
);
router.post(
  '/:offerId/comments/:commentId/reply',
  requireUserAuth,
  offerController.replyToComment
);
router.post(
  '/:offerId/comments/:commentId/replies/:replyId',
  requireUserAuth,
  offerController.likeCommentReply
);
router.get('/search', offerController.getOffersByLocationState);
router.get('/offer/:offerId', offerController.getSingleOfferDetails);
router.patch('/:offerId', requireUserAuth, offerController.updateOffer);
router.delete('/:offerId', requireUserAuth, offerController.deleteOffer);

module.exports = router;
