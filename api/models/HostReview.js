// Review from Host about a guest

const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');

class HostReview extends Model {}

HostReview.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    hostId: {
      type: DataTypes.INTEGER,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    reviewText: {
      type: DataTypes.TEXT,
    },
    guestId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'HostReview',
  }
);

module.exports = HostReview;
