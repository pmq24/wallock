<template>
  <nav class="dock fixed bottom-0 z-10">
    <WlLink
      v-for="{name, label, icons} in navItems"
      :key="name"
      :to="{ name: name }"
      :class="currentRoute.name === name && 'dock-active'"
    >
      <component :is="icons[currentRoute.name === name ? 'active' : 'inactive']" />
      <span class="dock-label">{{ label }}</span>
    </WlLink>
  </nav>

  <WlNewTransactionMobile class="fixed bottom-20 right-4" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { NavItem } from './common'
import WlLink from 'components/WlLink.vue'
import WlNewTransactionMobile from './WlNewTransactionMobile.vue'

const { navItems } = defineProps<{ navItems: NavItem[] }>()

const currentRoute = useRoute()
</script>
