<template>
  <WlMainNav>
    <header class="navbar lg:w-xl lg:mx-auto gap-2">
      <h1 class="text-xl font-bold flex-1">
        Settings
      </h1>
    </header>

    <main class="p-2 lg:w-xl lg:mx-auto">
      <ul class="menu menu-md w-full">
        <li
          v-for="navItem in navItems"
          :key="navItem.name"
        >
          <RouterLink :to="{name: navItem.name}">
            <component :is="navItem.icon" />
            {{ navItem.label }}
          </RouterLink>
        </li>
      </ul>
    </main>
  </WlMainNav>
</template>

<script setup lang="ts">
import { WlCategoryIcon, WlWalletIcon } from 'components/icons'
import WlMainNav from 'components/WlMainNav/WlMainNav.vue'

const navItems = [
  {
    name: 'categories',
    label: 'Categories',
    icon: WlCategoryIcon
  },
  {
    name: 'wallets',
    label: 'Wallets',
    icon: WlWalletIcon
  }
]
</script>
