<template>
  <nav class="flex flex-col gap-4 z-10 p-2 min-h-screen">
    <WlLink
      :to="{ name: 'home' }"
      class="h-8 w-fit p-1"
    >
      <img
        src="/public/logo/primary.svg"
        class="size-full"
      >
    </WlLink>

    <WlNewTransactionDesktop />

    <ul class="menu h-full w-60">
      <li
        v-for="{name, label, icons} in navItems"
        :key="name"
      >
        <WlLink
          :to="{ name }"
          :class="currentRoute.name === name && 'menu-active'"
        >
          <component
            :is="icons[currentRoute.name === name ? 'active' : 'inactive']"
            class="h-5 w-5"
          />
          {{ label }}
        </WlLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import WlNewTransactionDesktop from './WlNewTransactionDesktop.vue'
import { useRoute } from 'vue-router'
import type { NavItem } from './common'
import WlLink from 'components/WlLink.vue'

const { navItems } = defineProps<{ navItems: NavItem[] }>()

const currentRoute = useRoute()
</script>
