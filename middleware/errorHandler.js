function errorHandler(err, res) {
	res.status(500).json({
		error: {
			statusCode: 500,
			message: err
		}
	});
}

module.exports = errorHandler;
