const { Router } = require('express');
const { config } = require('../../config/setup');
const path = require('path');
const mkdirp = require('mkdirp');
const multer = require('multer');

const {
  requireUserAuth,
  requireAgentAuth,
  requireUserSelfAuth,
} = require('../middleware/authMiddleware');

const singleUserController = require('../controllers/singleUserController');
const router = require('./listingRoutes');

router.get('/:username/listings', singleUserController.getUserListings);
router.get('/:username/offers', singleUserController.getUserOffers);
module.exports = router;
