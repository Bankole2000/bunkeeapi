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
router.get('/:offerId', offerController.getSingleOfferDetails);
router.patch('/:offerId', offerController.updateOffer);
router.delete('/:offerId', offerController.deleteOffer);

module.exports = router;
