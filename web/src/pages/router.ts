import { createRouter, createWebHistory } from 'vue-router'
import GettingStartedCategories from './getting-started.categories/WlPage.vue'
import Categories from './categories/WlPage.vue'
import CategoriesNew from './categories.new/WlPage.vue'
import CategoriesIdEdit from './categories.id.edit/WlPage.vue'
import Sync from './sync/WlPage.vue'
import SyncAuthCallback from './sync.auth-callback/WlPage.vue'
import Settings from './settings/WlPage.vue'
import Transactions from './transactions/WlPage.vue'
import TransactionsNew from './transactions.new/WlPage.vue'
import Wallets from './wallets/WlPage.vue'
import WalletsId from './wallets.id/WlPage.vue'
import WalletsNew from './wallets.new/WlPage.vue'
import { api } from 'providers/api'

const routes = [
  {
    path: '/getting-started/categories',
    name: 'gettingStartedCategories',
    component: GettingStartedCategories,
  },

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
    path: '/categories/:id/edit',
    name: 'categoriesIdEdit',
    component: CategoriesIdEdit,
  },
  {
    path: '/sync',
    name: 'sync',
    component: Sync,
  },
  {
    path: '/sync/auth-callback',
    name: 'syncAuthCallback',
    component: SyncAuthCallback,
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
  const walletsExist = (await api.walletService.count()) > 0
  if (!walletsExist && to.name !== 'walletsNew') {
    return { name: 'walletsNew', query: { redirectOnSuccess: 'transactions' } }
  }

  const noCategory = (await api.categoryService.all()).length === 0
  if (
    to.name !== 'walletsNew' &&
    noCategory &&
    to.name !== 'gettingStartedCategories'
  ) {
    return { name: 'gettingStartedCategories' }
  }

  return true
})

export default router
