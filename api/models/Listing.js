const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const ListingImage = require('./ListingImage');
const Booking = require('./Booking');
const GuestReview = require('./GuestReview');

class Listing extends Model {}

Listing.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    ownerId: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pricePerNight: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    locationState: {
      type: DataTypes.STRING,
    },
    locationCountry: {
      type: DataTypes.STRING,
    },
    locationCity: {
      type: DataTypes.STRING,
    },
    buildingType: {
      type: DataTypes.STRING,
    },
    guestCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    typeOfListing: {
      // Entire place, private room or shared room
      type: DataTypes.STRING,
    },
    percentComplete: {
      type: DataTypes.INTEGER,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: 'listing',
  }
);

Listing.hasMany(ListingImage, {
  foreignKey: 'listingId',
});

Listing.hasMany(Booking);
Listing.hasMany(GuestReview);

ListingImage.belongsTo(Listing);
GuestReview.belongsTo(Listing);
Booking.belongsTo(Listing);

module.exports = Listing;
