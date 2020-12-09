const { Router } = require('express');
const { config } = require('../../config/setup');
const path = require('path');
const mkdirp = require('mkdirp');

const multer = require('multer');
// Setup file storage strategy
const storage = multer.diskStorage({
  // destination: path.resolve(__dirname, '.', 'uploads'),
  // destination: 'uploads/listingimages',
  destination: (req, file, cb) => {
    const uploadDir = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      `${req.userId}`,
      'listingImages'
    );
    const made = mkdirp.sync(uploadDir);
    const madeResized = mkdirp.sync(`${uploadDir}/resized`);
    console.log(`made directories, starting with ${made}`);
    // if (!fs.existsSync(uploadDir)) {
    //   fs.mkdirSync(uploadDir);
    // }
    cb(null, uploadDir);
  },
  // destination: function (req, file, cb) {
  //   console.log({ username: req.body.username, file: file });
  //   cb(null, `uploads/`); // (error, destination)
  // },
  filename: function (req, file, cb) {
    // cb(null, `${file.originalname}`); // (error, filename)
    cb(null, `${Date.now()}.jpeg`); // (error, filename)
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
router.get('/search', listingController.getListingsByLocationState);
router.post('/', requireUserAuth, listingController.createAListing);
router.post(
  '/:listingId/listingimage',
  requireUserAuth,
  upload.single('listingImage'),
  listingController.uploadListingImage
);
router.post('/:listingId/like', requireUserAuth, listingController.likeListing);

router.delete(
  '/:listingId/listingimage/:index',
  requireUserAuth,
  listingController.deleteListingImage
);
router.get('/listing/:listinguuid', listingController.getSingleListingDetails);
router.patch('/:listingId', listingController.updateListing);
router.delete('/:listingId', requireUserAuth, listingController.deleteListing);

module.exports = router;
