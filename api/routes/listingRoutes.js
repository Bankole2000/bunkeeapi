const { Router } = require('express');

const router = Router();

const {
  requireUserAuth,
  requireAgentAuth,
  requireUserSelfAuth,
} = require('../middleware/authMiddleware');

const listingController = require('../controllers/listingController');

router.get('/', listingController.getAllListings);
router.post('/', requireUserAuth, listingController.createAListing);
router.get('/:listingId', listingController.getSingleListingDetails);
router.patch('/:listingId', listingController.updateListing);
router.delete('/:listingId', listingController.deleteListing);

module.exports = router;
