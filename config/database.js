const { Sequelize } = require('sequelize');
const { config } = require('./setup');

module.exports = new Sequelize(config.db, config.user, config.password, {
  host: 'localhost',
  dialect: 'mysql',
});
