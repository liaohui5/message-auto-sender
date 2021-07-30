import Vue from 'vue';
import App from './App';
import router from './router';
import './plugins/element.js';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  ...App,
  router
}).$mount('#app');
