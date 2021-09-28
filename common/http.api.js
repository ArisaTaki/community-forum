const install = (Vue, vm) => {
	let api = {}
	// 获取广告轮播图数据信息
	api.getAdverts = params => vm.$u.get('/advertisingspace/advertising?space=1,2,3');

	// 获取动态列表信息
	api.getFeeds = params => vm.$u.get('/feeds', params)
	
	// 获取资讯列表信息
	api.getNews = params => vm.$u.get('/news', params)
	vm.$u.api = api
}

export default {
	install
}
