import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/wallets',
      name: 'wallets-index',
      component: () => import('@/pages/wallets-index.vue'),
    },
  ],
})

export default router
