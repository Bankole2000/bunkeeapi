const Booking = require('../models/Booking');

module.exports.getAllBookings = (req, res) => {
  res.status(200).json({ message: 'Get all Host Bookings is working' });
};

module.exports.createABooking = (req, res) => {
  res.status(200).json({ message: 'Create a Host Booking' });
};

module.exports.getSingleBookingDetails = (req, res) => {
  res.status(200).json({ message: 'Get single Host Booking details By Id' });
};

module.exports.updateBooking = (req, res) => {
  res.status(200).json({ message: 'update Host Booking By Id' });
};

module.exports.deleteBooking = (req, res) => {
  res.status(200).json({ message: 'Delete Host Booking by Id' });
};
