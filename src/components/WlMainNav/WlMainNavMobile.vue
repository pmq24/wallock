<template>
  <nav class="dock fixed bottom-0">
    <RouterLink
      v-for="{name, label, icons} in navItems"
      :key="name"
      :to="{ name: name }"
      :class="currentRoute.name === name && 'dock-active'"
    >
      <component :is="icons[currentRoute.name === name ? 'active' : 'inactive']" />
      <span class="dock-label">{{ label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { NavItem } from './common'

const { navItems } = defineProps<{ navItems: NavItem[] }>()

const currentRoute = useRoute()
</script>
