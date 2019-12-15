const Sequelize = require('sequelize');

const connection = require('../config/connection');
const City = require('./City');

const Subdistrict = connection.define('subdistrict', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  name: Sequelize.STRING
});

Subdistrict.belongsTo(City);

module.exports = Subdistrict;;
