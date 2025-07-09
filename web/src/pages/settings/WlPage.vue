<template>
  <WlMainNav>
    <header class="navbar gap-2">
      <h1 class="text-xl font-bold flex-1">
        Settings
      </h1>
    </header>

    <main class="p-2">
      <ul class="menu menu-md w-full">
        <li
          v-for="navItem in navItems"
          :key="navItem.name"
        >
          <WlLink :to="{name: navItem.name}">
            <component :is="navItem.icon" />
            {{ navItem.label }}
          </WlLink>
        </li>
      </ul>
    </main>
  </WlMainNav>
</template>

<script setup lang="ts">
import { WlCategoryIcon, WlWalletIcon } from 'components/icons'
import WlMainNav from 'components/WlMainNav/WlMainNav.vue'
import WlLink from 'components/WlLink.vue'
import type { Component } from 'vue'
import type { PageName } from 'pages/router'

const navItems: { name: PageName, label: string, icon: Component }[] = [
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
