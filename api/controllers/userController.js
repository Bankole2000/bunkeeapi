const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { config, helpers } = require('../../config/setup');
const { emailMaker } = require('../../config/emailMaker');
const validator = require('../../config/validator');

module.exports.getAllUsers = (req, res) => {
  res.status(200).json({ message: 'Get users is working ' });
};

module.exports.getSingleUserById = (req, res) => {
  const userId = req.params.userId;
  res.status(200).json({ message: `Details of user with id ${userId}` });
};

module.exports.userSignup = async (req, res) => {
  let {
    email,
    password,
    username,
    firstname,
    lastname,
    gender,
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
      const verficationUrl = `${config.baseUrl}/users/verify/${userToken}`;
      const result = await User.update(
        { emailVerificationToken: userToken },
        {
          where: { uuid: user.uuid },
        }
      );

      if (result[0]) {
        //#region
        // Make email here
        const emailText = emailMaker.makeSignupEmailTextOnly(
          user,
          verficationUrl
        );
        const emailBody = emailMaker.makeSignupEmailBody(user, verficationUrl);
        const emailToSend = emailMaker.makeEmailParams(
          '🏠 Bunkee API',
          user.email,
          `👋 Hi ${user.firstname}, Please Verify your email`,
          emailText,
          emailBody
        );
        let transporter = nodemailer.createTransport(emailMaker.transport);
        // send mail with defined transport object
        let info = await transporter.sendMail(emailToSend);
        console.log('Message sent: %s', info.messageId);
        //#endregion - Email ends here
        res.status(201).json({
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

module.exports.updateUser = (req, res) => {
  const userId = req.params.userId;
  res.status(200).json({ message: `Updated user with id ${userId}` });
};

module.exports.deleteUser = (req, res) => {
  const userId = req.params.userId;
  res.status(200).json({ message: `Deleted user with id ${userId}` });
};
