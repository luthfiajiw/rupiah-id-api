function responseHandler(res, data) {
	res.status(200).json({
		statusCode: 200,
		message: 'successful',
		data: data
	});
}

module.exports = responseHandler;
