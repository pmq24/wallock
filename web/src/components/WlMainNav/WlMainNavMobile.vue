<template>
  <div class="sticky bottom-0 left-0 right-0 z-10 flex flex-col gap-2">
    <WlLink
      :to="{ name: 'transactionsNew' }"
      class="btn btn-primary btn-lg w-fit self-end mr-2"
    >
      <WlAddIcon />
      New Transaction
    </WlLink>

    <nav class="dock static">
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
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { NavItem } from './common'
import WlLink from 'components/WlLink.vue'
import { WlAddIcon } from 'components/icons'

const { navItems } = defineProps<{ navItems: NavItem[] }>()

const currentRoute = useRoute()
</script>
