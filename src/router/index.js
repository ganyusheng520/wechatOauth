import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home'
import Success from '@/page/Success'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/success',
      name: 'success',
      component: Success
    }
  ]
})
