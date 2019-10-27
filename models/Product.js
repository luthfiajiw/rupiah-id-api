const Sequelize = require('sequelize');

const Category = require('./Category');
const connection = require('../config/connection');

const Product = connection.define('product', {
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  product_name: {
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
  },
  refcode: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true,
    defaultValue: '',
    validate: {
      notNull: {
        message: 'refcode is required.',
      },
      notEmpty: {
        message: 'refcode is required.',
      },
    },
  },
  base_price: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  price: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  stock: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  current_stock: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  }
});

Product.belongsTo(Category);

module.exports = Product;
