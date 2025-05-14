import { createRouter, createWebHistory } from 'vue-router'
import Categories from './categories/WlPage.vue'
import CategoriesNew from './categories.new/WlPage.vue'
import Settings from './settings/WlPage.vue'
import Transactions from './transactions/WlPage.vue'
import TransactionsNew from './transactions.new/WlPage.vue'
import Wallets from './wallets/WlPage.vue'
import WalletsId from './wallets.id/WlPage.vue'
import WalletsNew from './wallets.new/WlPage.vue'
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
    path: '/settings',
    name: 'settings',
    component: Settings,
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: Transactions,
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
  {
    path: '/wallets/:id',
    name: 'walletsId',
    component: WalletsId,
  },
  {
    path: '/wallets/new',
    name: 'walletsNew',
    component: WalletsNew,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const walletsExist = (await api.wallets.count()) > 0
  if (!walletsExist && to.name !== 'walletsNew') {
    return { name: 'walletsNew', query: { redirectOnSuccess: 'transactions' } }
  }

  return true
})

export default router
