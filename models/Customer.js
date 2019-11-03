const Sequelize = require('sequelize');

const connection = require('../config/connection');

const Customer = connection.define('customer', {
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
    defaultValue: '',
    validate: {
      notNull: {
        message: 'product name is required.',
      },
      notEmpty: {
        message: 'product name is required.',
      },
    },
    email: Sequelize.STRING,
    phone: Sequelize.INTEGER,
    address: Sequelize.TEXT,
  },
});

module.exports = Customer;
