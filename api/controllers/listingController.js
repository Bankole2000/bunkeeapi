const Listing = require('../models/Listing');

module.exports.getAllListings = (req, res) => {
  res.status(200).json({ message: 'Get all Host Listings is working' });
};

module.exports.createAListing = (req, res) => {
  res.status(200).json({ message: 'Create a Host Listing' });
};

module.exports.getSingleListingDetails = (req, res) => {
  res.status(200).json({ message: 'Get single Host Listing details By Id' });
};

module.exports.updateListing = (req, res) => {
  res.status(200).json({ message: 'update Host Listing By Id' });
};

module.exports.deleteListing = (req, res) => {
  res.status(200).json({ message: 'Delete Host Listing by Id' });
};
