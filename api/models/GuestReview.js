// Review from Guest about a host

const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const GuestReviewReply = require('./GuestReviewReply');

class GuestReview extends Model {}

GuestReview.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    guestReviewerUserId: {
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
    modelName: 'guestReview',
  }
);

GuestReview.hasMany(GuestReviewReply, {
  foreignKey: 'guestReviewId',
});

GuestReviewReply.belongsTo(GuestReview, {
  foreignKey: 'guestReviewId',
});

module.exports = GuestReview;
