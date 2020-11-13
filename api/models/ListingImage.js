const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');

class ListingImage extends Model {}

ListingImage.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    imageResizedUrl: {
      type: DataTypes.STRING,
    },
    imageFullsizeUrl: {
      type: DataTypes.STRING,
    },
    listingId: {
      type: DataTypes.INTEGER,
    },
    listingOrder: {
      type: DataTypes.INTEGER,
    },
    userGivenName: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: 'listingImage',
  }
);

module.exports = ListingImage;
