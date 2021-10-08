const install = (Vue, vm) => {
	let api = {}
	// 获取广告轮播图数据信息
	api.getAdverts = params => vm.$u.get('/advertisingspace/advertising?space=1,2,3');

	// 获取动态列表信息
	api.getFeeds = params => vm.$u.get('/feeds', params)

	// 获取资讯列表信息
	api.getNews = params => vm.$u.get('/news', params)

	// 获取指定ID动态评论详情
	api.getFeedInfo = params => vm.$u.get(`/feeds/${params.id}/comments`)

	// 删除指定ID的动态
	api.deleteFeed = params => vm.$u.delete(`/feeds/${params.id}/currency`)

	// 点赞动态
	api.likeThisFeed = params => vm.$u.post(`/feeds/${params.id}/like`)

	// 取消点赞
	api.cancelLikeThisFeed = params => vm.$u.delete(`/feeds/${params.id}/unlike`)

	// 发布一条动态
	api.postOneFeed = params => vm.$u.post(`/feeds`, params)

	// 评论一条动态
	api.commentOneFeed = params => vm.$u.post(`/feeds/${params.id}/comments`, {
		body: params.body
	})

	// 获取指定ID咨询详情
	api.getNewsInfo = params => vm.$u.get(`news/${params.id}`)

	// 获取指定 ID 资讯 评论详情
	api.getNewComments = params => vm.$u.get(`/news/${params.id}/comments`)

	// 点赞资讯
	api.likeThisNew = params => vm.$u.post(`/news/${params.id}/likes`)

	// 取消点赞资讯
	api.unlikeThisNew = params => vm.$u.delete(`/news/${params.id}/likes`)

	// 评论一条资讯
	api.commentOneInfo = params => vm.$u.post(`/news/${params.id}/comments`, {
		body: params.body
	})

	// 用户相关API
	// 查找用户信息
	api.findUser = params => vm.$u.get(`/user/${params.name}`)

	// 获取注册验证码
	api.getRegisterCode = params => vm.$u.post(`/verifycodes/register`, params)

	// 获取手机登录验证码
	api.getLoginCode = params => vm.$u.post('/verifycodes', params)

	// 注册
	api.userRegister = params => vm.$u.post('/users', params)

	// 登录
	api.userLogin = params => vm.$u.post('/auth/login', params)

	// 退出
	api.userLogout = () => vm.$u.post('auth/logout')

	// 获取当前登录用户相关的通知信息
	api.getUserMsg = () => vm.$u.get('/user/counts')

	// 文件上传操作
	api.uploadFile = async file => {
		let rfile = file
		// #ifndef MP-WEIXIN
		rfile = uni.getFileSystemManager().readFileSync(file.path)
		// #endif

		// 将文件写入后台系统
		let ufile = await uni.uploadFile({
			url: vm.$u.http.config.baseUrl + 'files',
			header: {
				Authoriztion: `Bearer${uni.getStorageSync("token")}`,
			},
			name: 'file',
			file: rfile,
			filePath: file.path
		});
		console.log(JSON.parse(unfile[1].data))
		return JSON.parse(ufile[1].data)
	}
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = api
}

export default {
	install
}
