<template>
  <nav class="flex flex-col gap-4 z-10">
    <WlLink
      :to="{ name: 'transactionsNew' }"
      class="btn btn-lg btn-primary m-2"
    >
      <WlAddIcon />
      New transaction
    </WlLink>

    <ul class="menu h-full w-56">
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
import { WlAddIcon } from 'components/icons'
import WlLink from 'components/WlLink.vue'

const { navItems } = defineProps<{ navItems: NavItem[] }>()

const currentRoute = useRoute()
</script>
