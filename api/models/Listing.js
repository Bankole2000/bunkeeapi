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
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pricePerNight: {
      type: DataTypes.INTEGER,
    },
    locationState: {
      type: DataTypes.STRING,
    },
    guestCapacity: {
      type: DataTypes.INTEGER,
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
