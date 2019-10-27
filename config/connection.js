const Sequelize = require('sequelize');

const connection = new Sequelize('event_app', 'newuser', 'password', {
  dialect: 'mysql',
})

module.exports = connection;
