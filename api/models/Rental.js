const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');

class Rental extends Model {}

Rental.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    agentId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'rental',
  }
);

module.exports = Rental;
