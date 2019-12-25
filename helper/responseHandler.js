function responseHandler(res, datas) {
	res.status(200).json({
		statusCode: 200,
		message: 'successful',
		results: {
			count: datas.count,
			page_context: {
				page: datas._page,
				per_page: datas.perPage,
				total_page: datas.total_page,
			},
			links: {
				nextUrl: datas._page === datas.total_page ? '' : datas.nextUrl,
				prevUrl: datas._page === 1 ? '' : datas.prevUrl,
				first: datas.first,
				last: datas.last,
			},
			data: datas.rows
		}
	});
}

module.exports = responseHandler;
