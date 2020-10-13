const Rental = require('../models/Rental');

module.exports.getAllRentals = (req, res) => {
  res.status(200).json({ message: 'Get all Rentals is working' });
};

module.exports.createRental = (req, res) => {
  res.status(200).json({ message: 'Create a Rentals' });
};

module.exports.updateRental = (req, res) => {
  res.status(200).json({ message: 'Update Rentals By Id' });
};

module.exports.deleteRental = (req, res) => {
  res.status(200).json({ message: 'Delete Rental By Id Rentals' });
};

module.exports.getRentalDetails = (req, res) => {
  res.status(200).json({ message: 'Get all Rentals' });
};
