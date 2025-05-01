import { createRouter, createWebHistory } from 'vue-router'

import HealthView from './views/HealthView.vue'

const routes = [{ path: '/health', component: HealthView }]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
