<template>
  <nav class="fixed left-0 top-0 bottom-0">
    <ul class="menu h-full w-56">
      <li
        v-for="{name, label, icons} in navItems"
        :key="name"
      >
        <RouterLink
          :to="{ name }"
          :class="currentRoute.name === name && 'menu-active'"
        >
          <component
            :is="icons[currentRoute.name === name ? 'active' : 'inactive']"
            class="h-5 w-5"
          />
          {{ label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { NavItem } from './common'

const { primaryNavItems, secondaryNavItems } = defineProps<{ primaryNavItems: NavItem[], secondaryNavItems: NavItem[] }>()
const navItems = [...primaryNavItems, ...secondaryNavItems]

const currentRoute = useRoute()
</script>
