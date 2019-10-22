import Vue from 'vue'
import Router from 'vue-router'
import Robot from '@/pages/Robot'

Vue.use(Router)

export default new Router({
  base: '/robot/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Robot',
      component: Robot
    },
    {
      path: '/robot',
      name: 'Robot1',
      component: Robot
    }
  ]
})
