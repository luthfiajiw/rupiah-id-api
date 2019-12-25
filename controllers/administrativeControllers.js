const Sequelize = require('sequelize');

const Province = require('../models/Province');
const City = require('../models/City');

const errorHandler = require('../helper/errorHandler');
const responseHandler = require('../helper/responseHandler');
const checkAuth= require('../config/check-auth');

module.exports = function (app) {

	// get all provinces
	app.get('/api/v1/provinces', checkAuth, (req, res, next) => {
		const { page, per_page } = req.query;

		let _page = page === undefined ? 1 : parseInt(page, 10);
		let perPage = per_page === undefined ? 10 : parseInt(per_page, 10);
		let nextUrl = `localhost:3000/api/v1/provinces?page=${_page+1}&per_page=${perPage}`;
		let prevUrl = `localhost:3000/api/v1/provinces?page=${_page-1}&per_page=${perPage}`;
		let first = `localhost:3000/api/v1/provinces?page=1&per_page=${perPage}`;

		Province.findAndCountAll({
			attributes: {exclude: ['createdAt', 'updatedAt']},
			limit: perPage,
			offset: (_page - 1) * 10
		})
  		.then(provinces => {
				const total_page = Math.ceil(provinces.count/perPage);
				const datas = {
					...provinces,
					_page, perPage,
					total_page,
					nextUrl,
					prevUrl,
					first,
					last: `localhost:3000/api/v1/provinces?page=${total_page}&per_page=${perPage}`
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
