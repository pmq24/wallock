<template>
  <div v-if="activeBreakpoint === ''">
    <WlMainNavMobile
      v-if="!hideOnMobile"
      :primary-nav-items
      :secondary-nav-items
    />
  </div>
  <WlMainNavDesktop
    v-else
    :primary-nav-items
    :secondary-nav-items
  />
  <slot />
</template>

<script setup lang="ts">
import { useBreakpoints } from 'common'
import WlMainNavMobile from './WlMainNavMobile.vue'
import WlMainNavDesktop from './WlMainNavDesktop.vue'
import { WlCategoryIcon, WlCategoryIconFilled, WlTransactionIcon, WlTransactionIconFilled, WlWalletIcon } from 'components/icons'
import WlWalletIconFilled from 'components/icons/WlWalletIconFilled.vue'

const { hideOnMobile } = defineProps<{ hideOnMobile?: boolean }>()

const { activeBreakpoint } = useBreakpoints()

const primaryNavItems = [
  {
    name: 'transactions',
    label: 'Transactions',
    icons: {
      active: WlTransactionIconFilled,
      inactive: WlTransactionIcon
    }
  },
]
const secondaryNavItems = [
  {
    name: 'categories',
    label: 'Categories',
    icons: {
      active: WlCategoryIconFilled,
      inactive: WlCategoryIcon
    }
  },
  {
    name: 'wallets',
    label: 'Wallets',
    icons: {
      active: WlWalletIconFilled,
      inactive: WlWalletIcon
    }
  }
]
</script>
