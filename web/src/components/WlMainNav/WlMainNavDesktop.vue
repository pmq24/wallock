<template>
  <nav class="flex flex-col gap-4 z-10 p-2">
    <WlLink
      :to="{ name: 'home' }"
      class="h-8 w-fit p-1"
    >
      <img
        src="/public/logo/primary.svg"
        class="size-full"
      >
    </WlLink>

    <WlLink
      :to="{ name: 'transactionsNew' }"
      class="btn btn-primary w-fit"
    >
      <WlAddIcon />
      New Transaction
    </WlLink>

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
import { useRoute } from 'vue-router'
import type { NavItem } from './common'
import WlLink from 'components/WlLink.vue'
import { WlAddIcon } from 'components/icons'

const { navItems } = defineProps<{ navItems: NavItem[] }>()

const currentRoute = useRoute()
</script>
