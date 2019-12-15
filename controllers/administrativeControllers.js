const Sequelize = require('sequelize');

const Province = require('../models/Province');
const City = require('../models/City');

const errorHandler = require('../middleware/errorHandler');
const responseHandler = require('../middleware/responseHandler');
const checkAuth= require('../config/check-auth');

module.exports = function (app) {

	// get all provinces
	app.get('/api/v1/provinces', checkAuth, (req, res, next) => {
		Province.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}})
  		.then(provinces => {
  			responseHandler(res, provinces);
  		})
  		.catch(err => {
  			errorHandler(500, err, res);
  		});
	});

	// get all cities
	app.get('/api/v1/cities', checkAuth, (req, res, next) => {
		City.findAll({
			attributes: {exclude: ['createdAt', 'updatedAt', 'provinceId']},
			include: [{
				model: Province,
				as: 'province',
				attributes: ['id', 'name']
			}]
		})
			.then(cities => {
				responseHandler(res, cities);
			})
			.catch(err => {
				errorHandler(500, err, res);
			});
	});

	// get cities based on province id
	app.get('/api/v1/provinces/:provinceId/cities', checkAuth, (req, res, next) => {
		const { provinceId } = req.params;

		City.findAll({
			where: {provinceId},
			attributes: {exclude: ['createdAt', 'updatedAt', 'provinceId']},
			include: [{
				model: Province,
				as: 'province',
				attributes: ['id', 'name']
			}]
		})
			.then(cities => {
				if (cities == null) {
					errorHandler(404, `City with province id ${provinceId} can not be found.`, res);
				}

				responseHandler(res, cities);
			});
	});
};
