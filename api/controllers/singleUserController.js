const { helpers, config } = require('../../config/setup');
const User = require('../models/User');
const Listing = require('../models/Listing');
const ListingImage = require('../models/ListingImage');
const Offer = require('../models/Offer');
const Comment = require('../models/Comment');
const CommentReply = require('../models/CommentReply');

module.exports.getUserListings = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      const listings = await Listing.findAll({
        where: {
          ownerId: user.id,
        },
        include: [ListingImage, { model: User, as: 'owner' }],
      });
      res.status(200).json({
        message: `Listings made by ${username}`,
        listings,
      });
    } else {
      throw helpers.generateError(
        `Can't find user with username - ${username}`,
        'username'
      );
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(404).json(errors);
  }
};

module.exports.getUserOffers = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      const offers = await Offer.findAndCountAll({
        where: {
          posterId: user.id,
        },
        include: [
          {
            model: Comment,
            include: [
              {
                model: CommentReply,
                include: {
                  model: User,
                  as: 'replier',
                  attributes: [
                    'id',
                    'profileImageUrl',
                    'dob',
                    'isAgent',
                    'firstname',
                    'gender',
                    'username',
                    'createdAt',
                  ],
                },
              },
              {
                model: User,
                as: 'commenter',
                attributes: [
                  'id',
                  'profileImageUrl',
                  'dob',
                  'isAgent',
                  'firstname',
                  'gender',
                  'username',
                  'createdAt',
                ],
              },
            ],
          },
          {
            model: User,
            as: 'poster',
            attributes: [
              'id',
              'profileImageUrl',
              'dob',
              'isAgent',
              'firstname',
              'gender',
              'username',
              'createdAt',
            ],
          },
        ],
      });
      res.status(200).json({ message: `Offers made by ${username}`, offers });
    } else {
      res
        .status(404)
        .json({ message: `No user with the username ${username}` });
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};
