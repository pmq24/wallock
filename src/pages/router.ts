import { createRouter, createWebHistory } from 'vue-router'
import Categories from './categories/WlPage.vue'
import CategoriesNew from './categories.new/WlPage.vue'
import DefaultWallet from './defaultWallet/WlPage.vue'
import TransactionsNew from './transactions.new/WlPage.vue'
import Wallets from './wallets/WlPage.vue'
import { api } from 'providers/api'

const routes = [
  {
    path: '/categories',
    name: 'categories',
    component: Categories,
  },
  {
    path: '/categories/new',
    name: 'categoriesNew',
    component: CategoriesNew,
  },
  {
    path: '/default-wallet',
    name: 'defaultWallet',
    component: DefaultWallet,
  },
  {
    path: '/transactions/new',
    name: 'transactionsNew',
    component: TransactionsNew,
  },
  {
    path: '/wallets',
    name: 'wallets',
    component: Wallets,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const walletsExist = (await api.wallets.count()) > 0
  if (!walletsExist && to.name !== 'defaultWallet') {
    return { name: 'defaultWallet' }
  }

  return true
})

export default router
