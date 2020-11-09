const jwt = require('jsonwebtoken');
const { helpers, config } = require('../../config/setup');
const User = require('../models/User');

const requireUserAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      if (token) {
        jwt.verify(token, config.jwtSecret, (err, user) => {
          if (err) {
            throw helpers.generateError('Token is Invalid', 'token');
          } else {
            req.userId = user.id;

            console.log(user, req.userId);
            next();
          }
        });
      } else {
        throw helpers.generateError('Missing Token in header', 'token');
      }
    } else {
      throw helpers.generateError('Missing Authorization header', 'header');
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(401).json(errors);
  }
  // console.log(token);
  // console.log(req.headers);
};

const requireUserSelfAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      if (token) {
        jwt.verify(token, config.jwtSecret, (err, user) => {
          if (err) {
            throw helpers.generateError('Token is Invalid', 'token');
          } else {
            if (user.id == req.params.userId || user.role == 'admin') {
              next();
            } else {
              console.log(user, `params ${req.params.userId}`);
              throw helpers.generateError(
                `Can't Do this coz it's not yours`,
                'Requires Self Ownership'
              );
            }
          }
        });
      } else {
        throw helpers.generateError('Missing Token in header', 'token');
      }
    } else {
      throw helpers.generateError('Missing Authorization header', 'header');
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(401).json(errors);
  }
  // console.log(token);
  // console.log(req.headers);
};

const requireAgentAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      if (token) {
        jwt.verify(token, config.jwtSecret, (err, user) => {
          if (err) {
            throw helpers.generateError('Token is Invalid', 'token');
          } else {
            if (user.isAgent || user.role == 'admin') {
              next();
            } else {
              console.log(user, `params ${req.params.userId}`);
              throw helpers.generateError(
                `Can't Do this coz it's not yours`,
                'Requires Self Ownership'
              );
            }
          }
        });
      } else {
        throw helpers.generateError('Missing Token in header', 'token');
      }
    } else {
      throw helpers.generateError('Missing Authorization header', 'header');
    }
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(401).json(errors);
  }
  // console.log(token);
  // console.log(req.headers);
};

const requireAdminAuth = (req, res, next) => {
  const token = req.headers.Authorization.split(' ')[1];
};

module.exports = { requireUserAuth, requireAgentAuth, requireUserSelfAuth };
