// Review from Guest about a host

const { Model, Sequelize, DataTypes } = require('sequelize');
const database = require('../../config/database');
const db = require('../../config/database');

class GuestReview extends Model {}

GuestReview.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    GuestReviewerId: {
      type: DataTypes.INTEGER,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    reviewText: {
      type: DataTypes.TEXT,
    },
    hostId: {
      type: DataTypes.INTEGER,
    },
    guestId: {
      type: DataTypes.INTEGER,
    },
    listingId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'GuestReview',
  }
);

module.exports = GuestReview;
