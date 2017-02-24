import Vue from 'vue'
import Router from 'vue-router'

import index from './index'
import cn from './docs/cn'
import en from './docs/en'

Vue.use(Router)

let router = new Router({
  mode: 'hash',
  routes: [{
    path: '/index',
    name: 'index',
    component: index
  }, {
    path: '/cn',
    name: 'cn',
    component: cn
  }, {
    path: '/en',
    name: 'en',
    component: en
  }, {
    path: '*',
    component: index
  }]
})

export default router
