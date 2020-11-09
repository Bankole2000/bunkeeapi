const { helpers, config } = require('../../config/setup');
const Listing = require('../models/Listing');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.findAll();
    res.status(200).json(listings);
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
  res.status(200).json({
    message: 'Get all Host Listings is working',
  });
};

module.exports.createAListing = async (req, res) => {
  // Listing.sync({ alter: true });
  try {
    const listing = await Listing.create({
      ownerId: req.userId,
      title: req.body.title,
      description: req.body.description,
      isPrivate: req.body.isPrivate,
      pricePerNight: req.body.pricePerNight,
      locationState: req.body.locationState,
      guestCapacity: req.body.guestCapacity,
    });
    res.status(201).json({ message: 'Listing Created', listing });
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.getSingleListingDetails = (req, res) => {
  res.status(200).json({ message: 'Get single Host Listing details By Id' });
};

module.exports.updateListing = (req, res) => {
  res.status(200).json({ message: 'update Host Listing By Id' });
};

module.exports.uploadListingImage = async (req, res, next) => {
  console.log(req.file);
  const { filename: listingImage } = req.file;

  await sharp(req.file.path)
    .resize(500)
    .jpeg({ quality: 50 })
    .toFile(path.resolve(req.file.destination, 'resized', listingImage))
    .then((info) => console.log(info));
  fs.unlinkSync(req.file.path);

  // console.log(req.file);
  res.status(200).json({
    message: 'upload Listing Image works',
    filePath: path.resolve(req.file.destination, 'resized', listingImage),
    url: `${config.baseUrl}/uploads/resized/${req.file.originalname}`,
  });
};

module.exports.deleteListing = (req, res) => {
  res.status(200).json({ message: 'Delete Host Listing by Id' });
};
