import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import uView from 'uview-ui'
Vue.use(uView)

Vue.prototype.BaseFileURL = 'http://ts.lagou.uieee.com/api/v2/files/'

// 引入公用组件uni-nav-bar
import uniNavBar from '@/components/uni-nav-bar/index.vue'
Vue.component('uni-nav-bar', uniNavBar)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})

import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif