const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const bcrypt = require('bcrypt');
const customValidator = require('../../config/validator');
const Listing = require('./Listing');
const Offer = require('./Offer');
const Agent = require('./Agent');
const Booking = require('./Booking');
const GuestReview = require('./GuestReview');
const HostReview = require('./HostReview');

class User extends Model {
  static LoginError(message, field) {
    const errors = [];
    errors.push({ message, path: field });

    return { errors };
  }
  static test(a) {
    console.log(a);
  }
  static async authenticateWithEmail(email, password) {
    const user = await this.findOne({ where: { email } });
    if (user) {
      const auth = bcrypt.compareSync(password, user.password); //returns a boolean
      if (auth) {
        return user;
      } else {
        throw this.LoginError('Incorrect Login Details', 'password');
      }
    } else {
      throw this.LoginError('Email or username is not registered', 'email');
    }
  }
  static async authenticateWithUsername(username, password) {
    const user = await this.findOne({ where: { username } });
    if (user) {
      const auth = bcrypt.compareSync(password, user.password); //returns a boolean
      if (auth) {
        return user;
      } else {
        throw this.LoginError('Incorrect Login Details', 'password');
      }
    } else {
      throw this.LoginError('Email or Username is not registered', 'email');
    }
  }
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'field cannot be null',
        },
        notEmpty: {
          msg: 'field cannot be empty',
        },
        isEmail: {
          msg: 'must be a Valid Email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'field cannot be null',
        },
        notEmpty: {
          msg: 'field cannot be empty',
        },
        minLength(value) {
          if (value.length < 6) {
            throw new Error('must have at least 6 characters');
          }
        },
      },
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'field cannot be null',
        },
        notEmpty: {
          msg: 'field cannot be empty',
        },
        minLength(value) {
          if (value.length < 3) {
            throw new Error('should be at least 3 characters');
          }
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'field cannot be null',
        },
        notEmpty: {
          msg: 'field cannot be empty',
        },
        minLength(value) {
          if (value.length < 3) {
            throw new Error('should be at least 3 characters');
          }
        },
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'field cannot be null',
        },
        notEmpty: {
          msg: 'field cannot be empty',
        },
        isIn: {
          args: [['male', 'female']],
          msg: 'must be either male or female',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'field cannot be null',
        },
        notEmpty: {
          msg: 'field cannot be empty',
        },
        islongEnough(value) {
          if (value.length < 3) {
            throw new Error('username is too short');
          }
        },
        isValidUsername(value) {
          if (!customValidator.isValidUsername(value)) {
            throw new Error('invalid Username');
          }
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailIsVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'field cannot be null',
        },
        isDate: {
          msg: 'Please enter a Valid Date',
        },
        isOverEighteen(value) {
          if (customValidator.isOfAge(value) < 18) {
            throw new Error('should be at least 18yrs old');
          }
        },
      },
    },
    tos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'field cannot be null',
        },
        acceptsTOS(value) {
          if (!value) {
            throw new Error('must Accept Terms of Service');
          }
        },
      },
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['user', 'admin', 'support']],
          msg: 'must be either male or female',
        },
      },
    },
    isAgent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phoneIsVerified: {
      type: DataTypes.BOOLEAN,
    },
    identityIsVerified: {
      type: DataTypes.BOOLEAN,
    },
    aboutMe: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: 'user',
    hooks: {
      beforeCreate: async (user, options) => {
        try {
          const salt = await bcrypt.genSalt();
          user.password = await bcrypt.hash(user.password, salt);
          console.log('user was created', user);
        } catch (error) {
          console.log(error);
        }
      },
    },
  }
);

User.hasMany(Listing, {
  foreignKey: 'ownerId',
});

User.hasMany(Offer, {
  foreignKey: 'posterId',
});

User.hasOne(Agent);

Listing.belongsTo(User, {
  foreignKey: 'ownerId',
});

Offer.belongsTo(User, {
  foreignKey: 'posterId',
});

Agent.belongsTo(User);

Booking.belongsTo(User, { as: 'guest' });
Booking.belongsTo(User, { as: 'host' });
HostReview.belongsTo(User, { as: 'host' });
HostReview.belongsTo(User, { as: 'guest' });
GuestReview.belongsTo(User, { as: 'host' });
GuestReview.belongsTo(User, { as: 'guest' });

module.exports = User;
