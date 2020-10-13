const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');

class Booking extends Model {}

Booking.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
    },
    checkOutdate: {
      type: DataTypes.DATEONLY,
    },
    listingId: {
      type: DataTypes.INTEGER,
    },
    hostId: {
      type: DataTypes.INTEGER,
    },
    guestId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'booking',
  }
);

module.exports = Booking;
