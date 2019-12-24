const Sequelize = require('sequelize');

const Province = require('../models/Province');
const City = require('../models/City');

const errorHandler = require('../helper/errorHandler');
const responseHandler = require('../helper/responseHandler');
const checkAuth= require('../config/check-auth');

module.exports = function (app) {

	// get all provinces
	app.get('/api/v1/provinces', checkAuth, (req, res, next) => {
		let page = 1;
		let per_page = 10;
		let nextUrl = `http://localhost:3000/api/v1/provinces?page=${page+1}&per_page=${per_page}`;
		let prevUrl = `http://localhost:3000/api/v1/provinces?page=${page-1}&per_page=${per_page}`;
		let first = `http://localhost:3000/api/v1/provinces?page=1&per_page=${per_page}`;

		Province.findAndCountAll({
			attributes: {exclude: ['createdAt', 'updatedAt']},
			limit: 10,
			offset: 0
		})
  		.then(provinces => {
				const datas = {
					...provinces,
					page, per_page,
					total_page: Math.ceil(provinces.count/per_page),
					nextUrl,
					prevUrl,
					first,
					last: `http://localhost:3000/api/v1/provinces?page=${Math.ceil(provinces.count/per_page)}&per_page=${per_page}`
				}
  			responseHandler(res, datas);
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
