const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');

class Review extends Model {}

Review.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    reviewerId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'Review',
  }
);

module.exports = Review;
