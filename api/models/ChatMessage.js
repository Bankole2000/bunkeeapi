const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');

class ChatMessage extends Model {}

ChatMessage.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    messageText: {
      type: DataTypes.STRING,
    },
    messageHasImage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    messageImageUrl: {
      type: DataTypes.STRING,
    },
    senderId: {
      type: DataTypes.INTEGER,
    },
    recieverId: {
      type: DataTypes.INTEGER,
    },
    hasBeenRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasBeenDelivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    conversationId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'chatMessage',
  }
);

module.exports = ChatMessage;
