const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const User = require('./User');

class Offer extends Model {}

Offer.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    posterId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'offer',
  }
);

module.exports = Offer;
