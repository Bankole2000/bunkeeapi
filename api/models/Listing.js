const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const ListingImage = require('./ListingImage');
const Booking = require('./Booking');
const GuestReview = require('./GuestReview');
const Promotion = require('./Promotion');

class Listing extends Model {
  getRules() {
    return this.rules ? JSON.parse(this.rules) : null;
  }
  getAmenities() {
    return this.amenities ? JSON.parse(this.amenities) : null;
  }
  getSpecialFeatures() {
    return this.specialFeatures ? JSON.parse(this.specialFeatures) : null;
  }
  getFinalDescriptions() {
    return this.finalDescriptions ? JSON.parse(this.finalDescriptions) : null;
  }
  getUtilities() {
    return this.utilities ? JSON.parse(this.utilities) : null;
  }
  getGuestPreferences() {
    return this.guestPreferences ? JSON.parse(this.guestPreferences) : null;
  }
  getLikedBy() {
    return this.likedBy ? JSON.parse(this.likedBy) : null;
  }
}

Listing.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    isSponsored: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ratings: {
      type: DataTypes.JSON,
    },
    ownerId: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    utilities: {
      type: DataTypes.JSON,
    },
    guestPreferences: {
      type: DataTypes.JSON,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    basicPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pricePerWeekend: {
      type: DataTypes.INTEGER,
    },
    pricePerWeek: {
      type: DataTypes.INTEGER,
    },
    pricePerMonth: {
      type: DataTypes.INTEGER,
    },
    guestArrivalDaysNotice: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    guestBookingMonthsInAdvance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bookingStayDaysMin: {
      type: DataTypes.INTEGER,
    },
    bookingStayDaysMax: {
      type: DataTypes.INTEGER,
    },
    locationState: {
      type: DataTypes.STRING,
    },
    locationCountry: {
      type: DataTypes.STRING,
    },
    locationCity: {
      type: DataTypes.STRING,
    },
    buildingType: {
      type: DataTypes.STRING,
    },
    guestCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    typeOfListing: {
      // Entire place, private room or shared room
      type: DataTypes.STRING,
    },
    percentComplete: {
      type: DataTypes.INTEGER,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    finalDescriptions: {
      type: DataTypes.JSON,
    },
    rules: {
      type: DataTypes.JSON,
    },
    amenities: {
      type: DataTypes.JSON,
    },
    specialFeatures: {
      type: DataTypes.JSON,
    },
    likedBy: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: db,
    modelName: 'listing',
  }
);

Listing.hasMany(ListingImage, {
  foreignKey: 'listingId',
});

Listing.hasMany(Booking);
Listing.hasMany(Promotion, {
  foreignKey: 'promotableId',
  scope: {
    promotable: 'listing',
  },
});
Listing.hasMany(GuestReview);
Promotion.belongsTo(Listing, {
  foreignKey: 'promotableId',
  scope: {
    promotable: 'listing',
  },
});

ListingImage.belongsTo(Listing);
GuestReview.belongsTo(Listing);
Booking.belongsTo(Listing);

module.exports = Listing;
