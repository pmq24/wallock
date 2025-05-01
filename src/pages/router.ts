import { createRouter, createWebHistory } from 'vue-router'
import GettingStarted from './gettingStarted/WlPage.vue'

const routes = [
  {
    path: '/getting-started',
    component: GettingStarted,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
