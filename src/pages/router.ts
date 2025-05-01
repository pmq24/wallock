import { createRouter, createWebHistory } from 'vue-router'
import DefaultWallet from './defaultWallet/WlPage.vue'
import GettingStarted from './gettingStarted/WlPage.vue'

const routes = [
  {
    path: '/default-wallet',
    component: DefaultWallet,
  },
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
