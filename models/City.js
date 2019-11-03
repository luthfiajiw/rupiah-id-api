const Sequelize = require('sequelize');

const connection = require('../config/connection');

const City = connection.define('city', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  city_name: Sequelize.STRING,
});

module.exports = City;
