const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const ChatMessage = require('./ChatMessage');

class ChatContact extends Model {}

ChatContact.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    inviterId: {
      type: DataTypes.INTEGER,
    },
    inviteeId: {
      type: DataTypes.INTEGER,
    },
    hasBeenAccepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasBeenDeclined: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    blockedBy: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'chatContact',
  }
);

ChatContact.hasMany(ChatMessage, {
  foreignKey: 'conversationId',
  as: 'conversation',
});

ChatMessage.belongsTo(ChatContact, {
  as: 'conversation',
});

module.exports = ChatContact;
