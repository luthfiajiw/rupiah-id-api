function errorHandler(statusCode, err, res) {
	res.status(statusCode).json({
		error: {
			statusCode,
			message: err
		}
	});
}

module.exports = errorHandler;
