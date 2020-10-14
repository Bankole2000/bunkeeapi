const { Router } = require('express');

const router = Router();

const {
  requireUserAuth,
  requireAgentAuth,
  requireUserSelfAuth,
} = require('../middleware/authMiddleware');

const rentalController = require('../controllers/rentalController');

router.get('/', rentalController.getAllRentals);
router.post('/', requireAgentAuth, rentalController.createRental);
router.patch('/:rentalId', rentalController.updateRental);
router.delete('/:rentalId', rentalController.deleteRental);
router.get('/:rentalId', rentalController.getRentalDetails);

module.exports = router;
