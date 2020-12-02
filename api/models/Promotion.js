const { Model, Sequelize, DataTypes } = require('sequelize');
const database = require('../../config/database');
const db = require('../../config/database');

class Promotion extends Model {}

Promotion.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    promotable: {
      type: DataTypes.STRING,
    },
    promotableId: {
      type: DataTypes.INTEGER,
    },
    paymentId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'promotion',
  }
);

module.exports = Promotion;
