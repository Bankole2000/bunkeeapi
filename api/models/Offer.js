const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const Comment = require('./Comment');
const Promotion = require('./Promotion');

class Offer extends Model {
  getNoOfLikes() {
    const likesArray = this.likedBy ? JSON.parse(this.likedBy) : [];
    console.log({ offerLikes: likesArray });
    return likesArray.length;
  }
  getNoOfComments() {
    return this.comments.length;
  }
}

Offer.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    posterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    likedBy: {
      type: DataTypes.JSON,
    },
    description: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    budget: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    lookingForRoommate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    locationState: {
      type: DataTypes.STRING,
    },
    locationCity: {
      type: DataTypes.STRING,
    },
    lookingForPlace: {
      type: DataTypes.BOOLEAN,
    },
    placePreferences: {
      type: DataTypes.JSON,
    },
    placeMustHave: {
      type: DataTypes.JSON,
    },
    roommatePreferences: {
      type: DataTypes.JSON,
    },
    roommateMustHave: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: db,
    modelName: 'offer',
  }
);

Offer.hasMany(Comment, {
  foreignKey: 'offerId',
});

Offer.hasMany(Promotion, {
  foreignKey: 'promotableId',
  scope: {
    promotable: 'offer',
  },
});

Promotion.belongsTo(Offer, {
  foreignKey: 'promotableId',
  scope: {
    promotable: 'offer',
  },
});

Comment.belongsTo(Offer, {
  foreignKey: 'offerId',
});

module.exports = Offer;
