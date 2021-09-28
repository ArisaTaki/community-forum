const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'http://ts.lagou.uieee.com/api/v2',
		loadingText: 'loading————',
		loadingTime: 800
	});

	Vue.prototype.$u.http.interceptor.request = config => {
		config.header.Token = 'xxxx'

		return config
	}

	Vue.prototype.$u.http.interceptor.response = res => {
			return res
	}
}

export default {
	install
}
