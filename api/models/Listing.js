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
    isSponsored: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ratings: {
      type: DataTypes.JSON,
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
    basicPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pricePerWeekend: {
      type: DataTypes.INTEGER,
    },
    pricePerWeek: {
      type: DataTypes.INTEGER,
    },
    pricePerMonth: {
      type: DataTypes.INTEGER,
    },
    guestArrivalDaysNotice: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bookMonthsInAdvance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bookingStayDaysMin: {
      type: DataTypes.INTEGER,
    },
    bookingStayDaysMax: {
      type: DataTypes.INTEGER,
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
    attributes: {
      type: DataTypes.JSON,
    },
    rules: {
      type: DataTypes.JSON,
    },
    amenities: {
      type: DataTypes.JSON,
    },
    specialFeatures: {
      type: DataTypes.JSON,
    },
    likedBy: {
      type: DataTypes.JSON,
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
