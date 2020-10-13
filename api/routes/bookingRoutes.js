const { Router } = require('express');

const router = Router();

const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createABooking);
router.get('/:bookingId', bookingController.getSingleBookingDetails);
router.patch('/:bookingId', bookingController.updateBooking);
router.delete('/:bookingId', bookingController.deleteBooking);

module.exports = router;
