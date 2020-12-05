const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');

class Notification extends Model {}

Notification.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    notificationType: {
      type: DataTypes.STRING,
    },
    senderId: {
      type: DataTypes.INTEGER,
    },
    recieverId: {
      type: DataTypes.INTEGER,
    },
    notificationText: {
      type: DataTypes.STRING,
    },
    notificationAction: {
      type: DataTypes.STRING,
    },
    notificationUrl: {
      type: DataTypes.STRING,
    },
    hasBeenSeen: {
      type: DataTypes.BOOLEAN,
    },
    associatedUsers: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: db,
    modelName: 'notification',
  }
);

module.exports = Notification;
