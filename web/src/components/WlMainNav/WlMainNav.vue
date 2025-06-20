<template>
  <WlMainNavMobile
    v-if="activeBreakpoint === ''"
    :nav-items
  />
  <WlMainNavDesktop
    v-else
    :nav-items
  />
  <div class="mb-30 lg:mb-0">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints } from 'common'
import WlMainNavMobile from './WlMainNavMobile.vue'
import WlMainNavDesktop from './WlMainNavDesktop.vue'
import { WlSettingIcon, WlTransactionIcon, WlTransactionIconFilled } from 'components/icons'
import WlSettingIconFilled from 'components/icons/WlSettingIconFilled.vue'
import type { NavItem } from './common'

const { activeBreakpoint } = useBreakpoints()

const navItems: NavItem[] = [
  {
    name: 'transactions',
    label: 'Transactions',
    icons: {
      active: WlTransactionIconFilled,
      inactive: WlTransactionIcon
    }
  },
  {
    name: 'settings',
    label: 'Settings',
    icons: {
      active: WlSettingIconFilled,
      inactive: WlSettingIcon
    }
  }
]
</script>
