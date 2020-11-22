const { Model, Sequelize, DataTypes } = require('sequelize');
const database = require('../../config/database');
const db = require('../../config/database');
const CommentReply = require('./CommentReply');

class Comment extends Model {
  getNoOfLikes() {
    const likesArray = this.likedBy ? JSON.parse(this.likedBy) : [];
    // console.log({ commentLikes: likesArray });
    return likesArray.length;
  }
  getNoOfReplies() {
    return this.commentReplies ? this.commentReplies.length : 0;
  }
}

Comment.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    commenterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offerId: {
      type: DataTypes.INTEGER,
    },
    likedBy: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: db,
    modelName: 'comment',
  }
);

Comment.hasMany(CommentReply, {
  foreignKey: 'commentId',
});

CommentReply.belongsTo(Comment, {
  foreignKey: 'commentId',
});

module.exports = Comment;
