const { Model, Sequelize, DataTypes } = require('sequelize');
const database = require('../../config/database');
const db = require('../../config/database');

class CommentReply extends Model {}

CommentReply.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    replierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reply: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likedBy: {
      type: DataTypes.JSON,
    },
    commentId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'commentReply',
  }
);

module.exports = CommentReply;
