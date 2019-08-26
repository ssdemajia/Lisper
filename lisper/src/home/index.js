import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import App from './App.vue'
import store from './store';
import router from './router.js';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
