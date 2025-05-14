<template>
  <WlMainNavMobile
    v-if="activeBreakpoint === ''"
    :nav-items
  />
  <WlMainNavDesktop
    v-else
    :nav-items
  />
  <slot />
</template>

<script setup lang="ts">
import { useBreakpoints } from 'common'
import WlMainNavMobile from './WlMainNavMobile.vue'
import WlMainNavDesktop from './WlMainNavDesktop.vue'
import { WlSettingIcon, WlTransactionIcon, WlTransactionIconFilled } from 'components/icons'
import WlSettingIconFilled from 'components/icons/WlSettingIconFilled.vue'

const { activeBreakpoint } = useBreakpoints()

const navItems = [
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
