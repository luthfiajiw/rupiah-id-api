const Sequelize = require('sequelize');

const connection = require('../config/connection');
const Product = require('./Product');
const Category = require('./Category');

const User = connection.define('user', {
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
        message: 'name is required',
      },
      notEmpty: {
        message: 'name is required',
      },
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
    defaultValue: '',
    validate: {
      notNull: {
        message: 'email is required',
      },
      notEmpty: {
        message: 'email is required',
      },
      isEmail: {
        message: 'enter a valid email address'
      }
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
    defaultValue: '',
    validate: {
      notNull: {
        message: 'password is required',
      },
      notEmpty: {
        message: 'password is required',
      },
    },
  },
});

User.hasMany(Product);
User.hasMany(Category);

module.exports = User;
