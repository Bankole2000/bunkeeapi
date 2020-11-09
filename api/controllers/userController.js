const User = require('../models/User');
const Listing = require('../models/Listing');
const Offer = require('../models/Offer');
const ListingImage = require('../models/ListingImage');
const HostReview = require('../models/HostReview');
const GuestReview = require('../models/GuestReview');
const Booking = require('../models/Booking');
const Agent = require('../models/Agent');
const Rental = require('../models/Rental');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { config, helpers } = require('../../config/setup');
const { emailMaker } = require('../../config/emailMaker');
const validator = require('../../config/validator');

module.exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ['username', 'lastname', 'firstname', 'email', 'uuid'],
    include: [
      Agent,
      {
        model: Listing,
        include: {
          model: ListingImage,
        },
        order: [[ListingImage, 'listingOrder', 'ASC']],
      },
      Offer,
      { model: HostReview, isAliased: 'host' },
      { model: GuestReview, isAliased: 'guest' },
    ],
    order: [
      [Listing, 'createdAt', 'DESC'],
      [Offer, 'createdAt', 'DESC'],
    ],
  });
  res.status(200).json({ message: 'Get all users', users });
};

module.exports.getSingleUserById = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByPk(userId);
  res.status(200).json({ message: `Details of user with id ${userId}`, user });
};

module.exports.userSignup = async (req, res) => {
  let {
    email,
    password,
    username,
    firstname,
    lastname,
    gender,
    profileImageUrl,
    dob,
    tos,
  } = req.body;
  try {
    if (email) {
      email = email.toLowerCase();
      User.sync({ alter: true });
      const user = await User.create({
        email,
        password,
        username,
        firstname,
        lastname,
        gender,
        profileImageUrl,
        dob,
        tos,
      });
      console.log(user);
      const userToken = helpers.createToken(jwt, {
        id: user.id,
        role: user.role,
        uuid: user.uuid,
        isAgent: user.isAgent,
      });
      // const verficationUrl = `${config.appUrl}/users/verify/${userToken}`;
      const result = await User.update(
        { emailVerificationToken: userToken },
        {
          where: { uuid: user.uuid },
        }
      );

      if (result[0]) {
        //#region
        // Make email here
        // const emailText = emailMaker.makeSignupEmailTextOnly(
        //   user,
        //   verficationUrl
        // );
        // const emailBody = emailMaker.makeSignupEmailBody(user, verficationUrl);
        // const emailToSend = emailMaker.makeEmailParams(
        //   '🏠 Bunkee API',
        //   user.email,
        //   `👋 Hi ${user.firstname}, Please Verify your email`,
        //   emailText,
        //   emailBody
        // );
        // let transporter = nodemailer.createTransport(emailMaker.transport);
        // // send mail with defined transport object
        // let info = await transporter.sendMail(emailToSend);
        // console.log('Message sent: %s', info.messageId);
        //#endregion - Email ends here
        res.status(201).json({
          success: true,
          message: `Signed up user on this route`,
          user: {
            id: user.id,
            uuid: user.uuid,
            email: user.email,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            gender: user.gender,
            token: userToken,
            emailIsVerified: user.emailIsVerified,
          },
        });
      }
    } else {
      throw helpers.generateError('invalid Email', 'email');
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
    console.log(errors);
  }
};

module.exports.verifyEmailToken = async (req, res) => {
  // User.sync({ alter: true });

  // try {
  //   const decodedToken = jwt.verify(req.params.token, config.jwtSecret);
  // } catch (err) {
  //   console.log(err);
  // }
  let id;
  try {
    jwt.verify(req.params.token, config.jwtSecret, (err, data) => {
      if (err) {
        throw helpers.generateError('Token is Invalid', 'token');
      } else {
        id = data.id;
      }
    });
    // console.log(data);
    console.log(id);
    const { emailIsVerified } = await User.findByPk(id);
    console.log(emailIsVerified);
    if (emailIsVerified) {
      throw helpers.generateError('Email is Already Verified', 'token');
    }
    const result = await User.update(
      { emailIsVerified: true },
      { where: { id } }
    );
    console.log(result);
    if (result[0]) {
      const user = await User.findByPk(id);
      res
        .status(200)
        .json({ message: 'Successfully verified email', user: user });
    } else {
      res.status(404).json({ message: "Token Has expired or doesn't exist" });
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(401).json(errors);
    console.log(err);
  }
};

module.exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  const emailOrUsername = email ? email : false;
  try {
    if (validator.isEmail(emailOrUsername)) {
      // Login with Email and password
      const user = await User.authenticateWithEmail(emailOrUsername, password);
      console.log(user);
      if (!user.emailIsVerified) {
        throw helpers.generateError('email is not verified', 'verification');
      } else {
        const userToken = helpers.createToken(jwt, {
          id: user.id,
          uuid: user.uuid,
          role: user.role,
          isAgent: user.isAgent,
        });
        res.status(200).json({
          message: `Login Successful`,
          token: userToken,
          user,
        });
      }
    } else if (validator.isValidUsername(emailOrUsername)) {
      // Login with username
      const user = await User.authenticateWithUsername(
        emailOrUsername,
        password
      );
      if (!user.emailIsVerified) {
        throw helpers.generateError('email is not verified', 'verification');
      } else {
        const userToken = helpers.createToken(jwt, {
          id: user.id,
          uuid: user.uuid,
          role: user.role,
          isAgent: user.isAgent,
        });

        res.status(200).json({
          message: `Login Successful`,
          token: userToken,
          user,
        });
      }
    } else {
      throw helpers.generateError('invalid email or username', 'email');
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    console.log(err);
    res.status(401).json(errors);
  }
};

module.exports.checkEmailIsTaken = async (req, res) => {
  const { email } = req.body;
  try {
    const taken = await User.findOne({ where: { email } });
    if (taken) {
      res.status(200).json({
        taken: true,
        message: `${email} is already taken`,
        takenBy: taken,
      });
    } else {
      res.status(404).json({
        taken: false,
        message: `${email} is available`,
        takenBy: taken,
      });
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.checkUsernameIsTaken = async (req, res) => {
  const { username } = req.body;
  try {
    const taken = await User.findOne({ where: { username } });
    if (taken) {
      res.status(200).json({
        taken: true,
        message: `${username} is already taken`,
        takenBy: taken,
      });
    } else {
      res.status(404).json({
        taken: false,
        message: `${username} is available`,
        takenBy: taken,
      });
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.updateUser = async (req, res) => {
  const id = req.params.userId;
  const updateData = {};
  for (const data of req.body) {
    updateData[data.name] = data.value;
  }
  try {
    const result = await User.update(updateData, {
      where: { id },
    });
    if (result[0]) {
      const updatedUser = await User.findByPk(id);
      res
        .status(200)
        .json({ message: `updated User with id ${id}`, updatedUser });
    } else {
      res.status(404).json({ message: `Unable to update User` });
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
  res.status(200).json({ message: `Updated user with id ${userId}` });
};

module.exports.deleteUser = (req, res) => {
  const userId = req.params.userId;
  res.status(200).json({ message: `Deleted user with id ${userId}` });
};
