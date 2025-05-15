<template>
  <nav class="fixed left-0 top-0 bottom-0 flex flex-col gap-4">
    <RouterLink
      :to="{ name: 'transactionsNew' }"
      class="btn btn-lg btn-primary m-2"
    >
      <WlAddIcon />
      New transaction
    </RouterLink>

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
import { WlAddIcon } from 'components/icons'

const { navItems } = defineProps<{ navItems: NavItem[] }>()

const currentRoute = useRoute()
</script>
