import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import user from './user';
import comment from './comment';

export default new Vuex.Store ({
  modules: {
    user,
    comment
  }
})