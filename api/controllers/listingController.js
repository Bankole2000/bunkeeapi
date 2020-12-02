const { helpers, config } = require('../../config/setup');
const Listing = require('../models/Listing');
const User = require('../models/User');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const ListingImage = require('../models/ListingImage');
const { Op } = require('sequelize');
const Offer = require('../models/Offer');
const Promotion = require('../models/Promotion');

module.exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.findAndCountAll({
      include: [ListingImage, User, Promotion],
    });
    listings.rows.forEach((listing) => {
      console.log(listing);
      listing.dataValues.rules = listing.getRules();
      listing.dataValues.amenities = listing.getAmenities();
      listing.dataValues.specialFeatures = listing.getSpecialFeatures();
      listing.dataValues.finalDescriptions = listing.getFinalDescriptions();
      listing.dataValues.utilities = listing.getUtilities();
      listing.dataValues.guestPreferences = listing.getGuestPreferences();
    });
    res.status(200).json(listings);
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.getListingsByLocationState = async (req, res) => {
  const noPerPage = 5;
  let offset, limit;

  let { state, page } = req.query;
  page = page ? page : 1;
  offset = (page - 1) * noPerPage;
  limit = offset + noPerPage;
  const stateSearchString = `${state} State`;
  try {
    const listings = await Listing.findAndCountAll({
      where: {
        [Op.or]: [
          { locationState: stateSearchString },
          { locationCity: state },
        ],
        [Op.or]: {
          locationState: {
            [Op.substring]: state,
          },
          locationCity: {
            [Op.substring]: state,
          },
        },
      },
      include: [ListingImage, User],
      offset,
      limit,
    });
    listings.rows.forEach((listing) => {
      // listing.dataValues.rules = JSON.parse(listing.dataValues.rules);
      listing.dataValues.rules = listing.getRules();
      listing.dataValues.amenities = listing.getAmenities();
      listing.dataValues.specialFeatures = listing.getSpecialFeatures();
      listing.dataValues.finalDescriptions = listing.getFinalDescriptions();
      listing.dataValues.utilities = listing.getUtilities();
      listing.dataValues.guestPreferences = listing.getGuestPreferences();
    });
    res.status(200).json({ message: 'Successful', listings, offset, page });
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
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
      include: [ListingImage, User],
    });
    if (listing) {
      listing.dataValues.rules = listing.getRules();
      listing.dataValues.amenities = listing.getAmenities();
      listing.dataValues.specialFeatures = listing.getSpecialFeatures();
      listing.dataValues.finalDescriptions = listing.getFinalDescriptions();
      listing.dataValues.utilities = listing.getUtilities();
      listing.dataValues.guestPreferences = listing.getGuestPreferences();
      res.status(200).json({ message: 'Listing Details', listing });
    } else {
      throw helpers.generateError(
        `No listing Found with id - ${id}`,
        'Listing Id'
      );
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
      updatedListing.dataValues.amenities = updatedListing.getAmenities();
      updatedListing.dataValues.rules = updatedListing.getRules();
      updatedListing.dataValues.specialFeatures = updatedListing.getSpecialFeatures();
      updatedListing.dataValues.finalDescriptions = updatedListing.getFinalDescriptions();
      updatedListing.dataValues.utilities = updatedListing.getUtilities();
      updatedListing.dataValues.guestPreferences = updatedListing.getGuestPreferences();
      res.status(200).json({
        message: `updated Listing with id ${id}`,
        listing: updatedListing,
      });
    } else {
      res.status(404).json({ message: `Unable to update Listing` });
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.deleteListingImage = async (req, res, next) => {
  console.log(req.body);
  const { listingId, index } = req.params;
  try {
    listing = await Listing.findByPk(listingId, { include: [ListingImage] });
    if (req.userId == listing.ownerId) {
      if (listing) {
        const hasListingImage = await ListingImage.findOne({
          where: { listingId, listingOrder: index },
        });
        if (hasListingImage) {
          fs.unlinkSync(hasListingImage.filePath);
          fs.unlinkSync(hasListingImage.resizedFilePath);
          await ListingImage.destroy({
            where: { listingId, listingOrder: index },
          });
          listing.listingImages.splice(
            listing.listingImages.findIndex((v) => v.listingOrder === index),
            1
          );
          res.status(200).json({
            message: 'Listing Image deleted',
            listing,
          });
        } else {
          throw helpers.generateError(
            `listing with id - ${listingId} doesn't have an image with index ${index}`,
            'listingId'
          );
        }
      } else {
        throw helpers.generateError(
          `No listing with the id ${id}`,
          'listingId'
        );
      }
    } else {
      throw helpers.generateError(
        `You don't own this listing, sorry`,
        'Auth - Actor is not owner'
      );
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(404).json(errors);
  }
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
  try {
    listing = await Listing.findByPk(listingId, { include: [ListingImage] });
    if (listing) {
      hasListingImage = await ListingImage.findOne({
        where: { listingId, listingOrder: req.body.index },
      });
      if (hasListingImage) {
        fs.unlinkSync(hasListingImage.filePath);
        fs.unlinkSync(hasListingImage.resizedFilePath);

        hasListingImage.update({
          filePath: req.file.path,
          resizedFilePath: `${req.file.destination}/resized/${req.file.filename}`,
          imageResizedUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/resized/${req.file.filename}`,
          imageFullsizeUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/${req.file.filename}`,
          listingOrder: req.body.index,
          userGivenName: req.body.userGivenName,
        });
        res.status(200).json({
          message: 'updated Listing Image',
          resizedFilePath: `${req.file.destination}/resized/${req.file.filename}`,
          filePath: path.resolve(req.file.destination, 'resized', listingImage),
          imageResizedUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/resized/${req.file.filename}`,
          imageFullsizeUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/${req.file.filename}`,
          listingOrder: req.body.index,
          listing,
          hasListingImage,
        });
      } else {
        newListingImage = await ListingImage.create({
          filePath: req.file.path,
          resizedFilePath: `${req.file.destination}/resized/${req.file.filename}`,
          imageResizedUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/resized/${req.file.filename}`,
          imageFullsizeUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/${req.file.filename}`,
          listingOrder: req.body.index,
          userGivenName: req.body.userGivenName,
        });

        await listing.addListingImage(newListingImage);
        res.status(200).json({
          message: 'uploaded Listing Image',
          filePath: req.file.path,
          resizedFilePath: path.resolve(
            req.file.destination,
            'resized',
            listingImage
          ),
          imageResizedUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/resized/${req.file.filename}`,
          imageFullsizeUrl: `${config.baseUrl}/uploads/${req.userId}/listingimages/${req.file.filename}`,
          listingOrder: req.body.index,
          listing,
          newListingImage,
        });
      }
    } else {
      throw helpers.generateError(`No listing with the id ${id}`, 'listingId');
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(404).json(errors);
  }
};

module.exports.deleteListing = async (req, res) => {
  const { listingId } = req.params;
  try {
    const listing = await Listing.findByPk(listingId, {
      include: [ListingImage],
    });
    if (listing) {
      if (listing.ownerId == req.userId) {
        if (listing.listingImages.length > 0) {
          listing.listingImages.forEach((image) => {
            fs.unlinkSync(image.filePath);
            fs.unlinkSync(image.resizedFilePath);
          });
        }
        await Listing.destroy({
          where: {
            id: listingId,
            ownerId: req.userId,
          },
        });
        res.status(200).json({
          message: `listing with ${listingId} deleted`,
        });
      } else {
        throw helpers.generateError(
          `You don't own this listing, sorry`,
          'Auth - Actor is not owner'
        );
      }
    } else {
      throw helpers.generateError(
        `No listing with the id ${listingId}`,
        'listingId'
      );
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(404).json({ errors, err });
  }
};

module.exports.likeListing = async (req, res) => {
  // Listing.sync({ alter: true });
  const { listingId } = req.params;
  const userId = req.userId;
  console.log(listingId, userId);
  try {
    let listing = await Listing.findByPk(listingId);
    if (listing) {
      const likers = listing.likedBy ? listing.getLikedBy() : [];
      if (likers.includes(userId)) {
        likers.splice(likers.indexOf(userId), 1);
        const result = await Listing.update(
          { likedBy: likers },
          { where: { id: listingId } }
        );
        if (result[0]) {
          listing = await Listing.findByPk(listingId);
          res.status(200).json({
            message: `User - ${userId} Disliked Listing - ${listingId}`,
            listing,
          });
        } else {
          res
            .status(500)
            .json({ message: `Couldn't update Listing - Server error` });
        }
      } else {
        likers.push(userId);
        const result = await Listing.update(
          { likedBy: likers },
          { where: { id: listingId } }
        );
        if (result[0]) {
          listing = await Listing.findByPk(listingId);
          res.status(200).json({
            message: `User - ${userId} Liked Listing - ${listingId}`,
            listing,
          });
        } else {
          res
            .status(500)
            .json({ message: `Couldn't update Listing - Server error` });
        }
      }
    } else {
      throw helpers.generateError(
        `No listing with id - ${listingId} - Not Found`,
        'Listing Id'
      );
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

// module.exports = function (io) {
//   //Socket.IO
//   io.on('connection', function (socket) {
//     console.log('User has connected to Index');
//     //ON Events
//     socket.on('admin', function () {
//       console.log('Successful Socket Test');
//     });

//     //End ON Events
//   });
//   return router;
// };
