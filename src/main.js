import 'babel-polyfill'
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'common/stylus/index.styl'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
Vue.config.productionTip = false
fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
