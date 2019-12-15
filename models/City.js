const Sequelize = require('sequelize');

const connection = require('../config/connection');
const cities = require('../data/cities');
const Province = require('./Province');

const City = connection.define('city', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	name: Sequelize.STRING,
});

City.belongsTo(Province);

// City.bulkCreate(cities).then(result => console.log(result));

module.exports = City;
