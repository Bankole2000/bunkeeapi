const { helpers, config } = require('../../config/setup');
const Listing = require('../models/Listing');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const ListingImage = require('../models/ListingImage');

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
      locationCountry: req.body.locationCountry,
      locationCity: req.body.locationCity,
      buildingType: req.body.buildingType,
      guestCapacity: req.body.guestCapacity,
      typeOfListing: req.body.typeOfListing,
      percentComplete: req.body.percentComplete,
    });
    res.status(201).json({ message: 'Listing Created', listing });
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.getSingleListingDetails = async (req, res) => {
  const id = req.params.listingId;
  try {
    const listing = await Listing.findByPk(id, {
      include: [ListingImage],
    });
    if (listing) {
      res.status(200).json({ message: 'Listing Details', listing });
    } else {
      res.status(404).json({ message: 'Found Listing', listing });
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.updateListing = async (req, res) => {
  const id = req.params.listingId;
  const updateData = {};
  for (const data of req.body) {
    updateData[data.name] = data.value;
  }
  try {
    const result = await Listing.update(updateData, {
      where: { id },
    });
    if (result[0]) {
      const updatedListing = await Listing.findByPk(id, {
        include: [ListingImage],
      });
      res.status(200).json({
        message: `updated Listing with id ${id}`,
        listing: updatedListing,
      });
    } else {
      res.status(404).json({ message: `Unable to update Listing` });
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
  res.status(200).json({ message: 'update Host Listing By Id' });
};

module.exports.uploadListingImage = async (req, res, next) => {
  console.log(req.file, req.body);
  const { filename: listingImage } = req.file;

  await sharp(req.file.path)
    .resize(426, 300)
    .jpeg({ quality: 50 })
    .toFile(path.resolve(req.file.destination, 'resized', listingImage))
    // .toFile('output')
    .then((info) => console.log(info));
  // fs.unlinkSync(req.file.path);
  const listingId = req.params.listingId;
  listing = await Listing.findByPk(listingId);
  listingImage = await ListingImage.create({
    imageResizedUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/resized/${req.file.filename}`,
    imageFullsizeUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/${req.file.filename}`,
    listingOrder: req.body.index,
    userGivenName: req.body.userGivenName,
  });
  await listing.addListingImage(listingImage);
  // console.log(req.file);
  res.status(200).json({
    message: 'uploaded Listing Image',
    filePath: path.resolve(req.file.destination, 'resized', listingImage),
    imageResizedUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/resized/${req.file.filename}`,
    imageFullsizeUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/${req.file.filename}`,
    listingOrder: req.body.index,
  });
};

module.exports.deleteListing = (req, res) => {
  res.status(200).json({ message: 'Delete Host Listing by Id' });
};
