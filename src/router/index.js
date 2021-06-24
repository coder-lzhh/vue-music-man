import { createRouter, createWebHashHistory } from 'vue-router'
import Recommend from '@/views/recommend.vue'

const routes = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search.vue')
  },
  {
    path: '/top-list',
    name: 'topList',
    component: () => import('../views/top-list.vue')
  },
  {
    path: '/singer',
    name: 'singer',
    component: () => import('../views/singer.vue'),
    children: [{
      path: ':id',
      component: () => import('../views/singer-detail.vue')
    }]
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
