import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 导入nprogress
import NProgress from 'nprogress'
// 导入nprogress的样式
// 由于通过CDN引用了，因此此处不需要在引用了
// import 'nprogress/nprogress.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles 导入富文本编辑器的样式
// 由于通过CDN引用了，因此此处不需要在引用了
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 配置axios
Vue.prototype.$http = axios
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 进度条开启
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  // 进度条隐藏
  NProgress.done()
  return config
})

// 挂载到vue的全局实例上
Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false
// 配置时间的过滤器
Vue.filter('dateFormat', function (value) {
  const time = new Date(value)
  const y = time.getFullYear()
  const m = (time.getMonth() + 1 + '').padStart(2, '0')
  const d = (time.getDate() + '').padStart(2, '0')
  const hh = (time.getHours() + '').padStart(2, '0')
  const mm = (time.getMinutes() + '').padStart(2, '0')
  const ss = (time.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
