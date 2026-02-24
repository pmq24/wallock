import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/wallets',
      name: 'wallets-index',
      component: () => import('@/pages/wallets-index.vue'),
    },
    {
      path: '/categories',
      name: 'categories-index',
      component: () => import('@/pages/categories-index.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions-index',
      component: () => import('@/pages/transactions-index.vue'),
    }
  ],
})

export default router
