const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const User = require('./User');

class GuestReviewReply extends Model {}

GuestReviewReply.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    guestReviewId: {
      type: DataTypes.INTEGER,
    },
    guestReviewReplyUserId: {
      type: DataTypes.INTEGER,
    },
    reviewReplyText: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: 'guestReviewReply',
  }
);

module.exports = GuestReviewReply;
