const { Router } = require('express');

const router = Router();

const rentalController = require('../controllers/rentalController');

router.get('/', rentalController.getAllRentals);
router.post('/', rentalController.createRental);
router.patch('/:rentalId', rentalController.updateRental);
router.delete('/:rentalId', rentalController.deleteRental);
router.get('/:rentalId', rentalController.getRentalDetails);

module.exports = router;
