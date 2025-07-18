<template>
  <div
    v-if="activeBreakpoint === ''"
    class="min-h-screen flex flex-col"
  >
    <div class="grow">
      <slot />
    </div>
    <WlMainNavMobile :nav-items />
  </div>

  <div
    v-else
    class="flex justify-center gap-2"
  >
    <div>
      <WlMainNavDesktop
        :nav-items
        class="sticky top-0"
      />
    </div>

    <!--
      Explain how min-w-0 prevent flex items from overflow:
      https://stackoverflow.com/questions/36230944/prevent-flex-items-from-overflowing-a-container
    -->
    <div class="min-w-0 max-w-3xl flex-auto mb-30 lg:mb-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints } from 'common'
import WlMainNavMobile from './WlMainNavMobile.vue'
import WlMainNavDesktop from './WlMainNavDesktop.vue'
import { WlHomeIcon, WlHomeIconFilled, WlSettingIcon, WlTransactionIcon, WlTransactionIconFilled } from 'components/icons'
import WlSettingIconFilled from 'components/icons/WlSettingIconFilled.vue'
import type { NavItem } from './common'

const { activeBreakpoint } = useBreakpoints()

const navItems: NavItem[] = [
  {
    name: 'home',
    label: 'Home',
    icons: {
      active: WlHomeIconFilled,
      inactive: WlHomeIcon
    }
  },
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
