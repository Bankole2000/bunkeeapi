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
    description: {
      type: DataTypes.STRING,
    },
    budget: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: 'offer',
  }
);

module.exports = Offer;
