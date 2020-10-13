const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');

class ListingImage extends Model {}

ListingImage.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    listingId: {
      type: DataTypes.INTEGER,
    },
    listingOrder: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: 'listingImage',
  }
);

module.exports = ListingImage;
