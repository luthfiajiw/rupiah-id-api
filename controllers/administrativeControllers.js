const Sequelize = require('sequelize');

const Province = require('../models/Province');
const City = require('../models/City');

const errorHandler = require('../helper/errorHandler');
const responseHandler = require('../helper/responseHandler');
const paginationHandler = require('../helper/paginationHandler');
const checkAuth= require('../config/check-auth');

module.exports = function (app) {

	// get all provinces
	app.get('/api/v1/provinces', checkAuth, (req, res, next) => {
		const { page, per_page } = req.query;

		let _page = page === undefined ? 1 : parseInt(page, 10);
		let perPage = per_page === undefined ? 10 : parseInt(per_page, 10);

		Province.findAndCountAll({
			attributes: {exclude: ['createdAt', 'updatedAt']},
			limit: perPage,
			offset: (_page - 1) * 10
		})
  		.then(provinces => {
				const totalPage = Math.ceil(provinces.count/perPage);
				const pagination = paginationHandler(_page, perPage, totalPage);
				const datas = {
					...provinces,
					...pagination,
				}
  			responseHandler(res, datas);
  		})
  		.catch(err => {
  			errorHandler(500, err, res);
  		});
	});

	// get all cities
	app.get('/api/v1/cities', checkAuth, (req, res, next) => {
		const { page, per_page } = req.query;

		let _page = page === undefined ? 1 : parseInt(page, 10);
		let perPage = per_page === undefined ? 10 : parseInt(per_page, 10);

		City.findAndCountAll({
			attributes: {exclude: ['createdAt', 'updatedAt', 'provinceId']},
			include: [{
				model: Province,
				as: 'province',
				attributes: ['id', 'name']
			}],
			limit: perPage,
			offset: (_page - 1) * 10
		})
			.then(cities => {
				const totalPage = Math.ceil(cities.count/perPage);
				const pagination = paginationHandler(_page, perPage, totalPage);
				const datas = {
					...cities,
					...pagination,
				}
				responseHandler(res, datas);
			})
			.catch(err => {
				errorHandler(500, err, res);
			});
	});

	// get cities based on province id
	app.get('/api/v1/provinces/:provinceId/cities', checkAuth, (req, res, next) => {
		const { provinceId } = req.params;
		const { page, per_page } = req.query;

		let _page = page === undefined ? 1 : parseInt(page, 10);
		let perPage = per_page === undefined ? 10 : parseInt(per_page, 10);

		City.findAndCountAll({
			where: {provinceId},
			attributes: {exclude: ['createdAt', 'updatedAt', 'provinceId']},
			include: [{
				model: Province,
				as: 'province',
				attributes: ['id', 'name']
			}],
			limit: perPage,
			offset: (_page - 1) * 10
		})
			.then(cities => {
				if (cities == null) {
					errorHandler(404, `City with province id ${provinceId} can not be found.`, res);
				}
				const totalPage = Math.ceil(cities.count/perPage);
				const pagination = paginationHandler(_page, perPage, totalPage);
				const datas = {
					...cities,
					...pagination,
				}
				responseHandler(res, datas);
			});
	});
};
