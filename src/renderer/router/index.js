import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/home/index';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      // component: require('@/views/home/index').default
      component: Home
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
