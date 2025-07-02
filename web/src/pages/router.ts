import { createRouter, createWebHistory } from 'vue-router'
import GettingStartedCategories from './getting-started.categories/WlPage.vue'
import Home from './home/WlPage.vue'
import Categories from './categories/WlPage.vue'
import CategoriesNew from './categories.new/WlPage.vue'
import CategoriesIdEdit from './categories.id.edit/WlPage.vue'
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
  } as const,

  {
    path: '/',
    name: 'home',
    component: Home
  } as const,

  {
    path: '/categories',
    name: 'categories',
    component: Categories,
  } as const,
  {
    path: '/categories/new',
    name: 'categoriesNew',
    component: CategoriesNew,
  } as const,
  {
    path: '/categories/:id/edit',
    name: 'categoriesIdEdit',
    component: CategoriesIdEdit,
  } as const,
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
  } as const,
  {
    path: '/transactions',
    name: 'transactions',
    component: Transactions,
  } as const,
  {
    path: '/transactions/new',
    name: 'transactionsNew',
    component: TransactionsNew,
  } as const,
  {
    path: '/wallets',
    name: 'wallets',
    component: Wallets,
  } as const,
  {
    path: '/wallets/:id',
    name: 'walletsId',
    component: WalletsId,
  } as const,
  {
    path: '/wallets/new',
    name: 'walletsNew',
    component: WalletsNew,
  } as const,
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

  const noCategory = (await api.categoryService.getAll()).length === 0
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

export type PageName = (typeof routes)[number]['name']
