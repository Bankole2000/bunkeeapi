const { Router } = require('express');

const router = Router();

const {
  requireUserAuth,
  requireAgentAuth,
  requireUserSelfAuth,
} = require('../middleware/authMiddleware');

const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.getAllBookings);
router.post('/', requireUserAuth, bookingController.createABooking);
router.get('/:bookingId', bookingController.getSingleBookingDetails);
router.patch('/:bookingId', bookingController.updateBooking);
router.delete('/:bookingId', bookingController.deleteBooking);

module.exports = router;
