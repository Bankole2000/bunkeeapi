const Offer = require('../models/Offer');

module.exports.getAllOffers = (req, res) => {
  res.status(200).json({ message: 'Get all Coop Offers is working' });
};

module.exports.createAnOffer = (req, res) => {
  res.status(200).json({ message: 'Create a Coop Offer' });
};

module.exports.getSingleOfferDetails = (req, res) => {
  res.status(200).json({ message: 'Get single Coop Offer details By Id' });
};

module.exports.updateOffer = (req, res) => {
  res.status(200).json({ message: 'update Coop Offer By Id' });
};

module.exports.deleteOffer = (req, res) => {
  res.status(200).json({ message: 'Delete Cooper Offer by Id' });
};
