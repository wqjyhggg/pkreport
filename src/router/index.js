import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import User from '@/components/User'
import Login from '@/components/Login'
import Setup from '@/components/Setup'
import Dayend from '@/reports/Dayend'
import Category from '@/reports/Category'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      name: 'Setup',
      component: Setup
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/dayend',
      name: 'Day End',
      component: Dayend
    },
    {
      path: '/category',
      name: 'Category',
      component: Category
    },
    {
      path: '/user/:para',
      name: 'User',
      component: User
    }
  ]
})
