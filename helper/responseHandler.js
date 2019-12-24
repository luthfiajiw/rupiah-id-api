function responseHandler(res, datas) {
	res.status(200).json({
		statusCode: 200,
		message: 'successful',
		results: {
			count: datas.count,
			page_context: {
				page: datas.page,
				per_page: datas.per_page,
				total_page: datas.total_page,
			},
			links: {
				nextUrl: datas.page === datas.total_page ? '' : datas.nextUrl,
				prevUrl: datas.page === 1 ? '' : datas.prevUrl,
				first: datas.first,
				last: datas.last,
			},
			data: datas.rows
		}
	});
}

module.exports = responseHandler;
