const Sequelize = require('sequelize');

const connection = require('../config/connection');
const provinces = require('../data/provinces');

const Province = connection.define('province', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	name: Sequelize.STRING
});

// Province.bulkCreate(provinces).then(result => console.log(result));

module.exports = Province;
