const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const Rental = require('./Rental');

class Agent extends Model {}

Agent.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'agent',
  }
);

Agent.hasMany(Rental);

Rental.belongsTo(Agent);

module.exports = Agent;
