const { Router } = require('express');

const router = Router();

const offerController = require('../controllers/offerController');

router.get('/', offerController.getAllOffers);
router.post('/', offerController.createAnOffer);
router.get('/:offerId', offerController.getSingleOfferDetails);
router.patch('/:offerId', offerController.updateOffer);
router.delete('/:offerId', offerController.deleteOffer);

module.exports = router;
