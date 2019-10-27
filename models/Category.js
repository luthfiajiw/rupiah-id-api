const Sequelize = require('sequelize');

const connection = require('../config/connection');

const Category = connection.define('category', {
  uuid:  {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  category_name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
    trim: true,
    validate: {
      notNull: {
        message: 'category name is required',
      },
      notEmpty: {
        message: 'category name is required',
      },
    },
  },
});

module.exports = Category;
