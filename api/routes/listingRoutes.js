const { Router } = require('express');
const { config } = require('../../config/setup');
const path = require('path');

const multer = require('multer');
// Setup file storage strategy
const storage = multer.diskStorage({
  // destination: path.resolve(__dirname, '.', 'uploads'),
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // (error, destination)
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`); // (error, filename)
  },
});

// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });
const router = Router();

const {
  requireUserAuth,
  requireAgentAuth,
  requireUserSelfAuth,
} = require('../middleware/authMiddleware');

const listingController = require('../controllers/listingController');

router.get('/', listingController.getAllListings);
router.post('/', requireUserAuth, listingController.createAListing);
router.post(
  '/listingimage',
  upload.single('listingImage'),
  listingController.uploadListingImage
);
router.get('/:listingId', listingController.getSingleListingDetails);
router.patch('/:listingId', listingController.updateListing);
router.delete('/:listingId', listingController.deleteListing);

module.exports = router;
