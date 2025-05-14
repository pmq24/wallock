<template>
  <nav class="dock fixed bottom-0">
    <RouterLink
      v-for="{name, label, icons} in primaryNavItems"
      :key="name"
      :to="{ name: name }"
      :class="currentRoute.name === name && 'dock-active'"
    >
      <component :is="icons[currentRoute.name === name ? 'active' : 'inactive']" />
      <span class="dock-label">{{ label }}</span>
    </RouterLink>

    <button @click="settingDialog?.showModal()">
      <WlSettingIcon />
      <span class="dock-label">Settings</span>
    </button>
  </nav>

  <dialog
    ref="settings-dialog"
    class="modal"
  >
    <div class="modal-box w-full h-full p-2 gap-2">
      <header class="navbar">
        <button
          class="btn btn-ghost btn-square"
          @click="settingDialog?.close()"
        >
          <WlBackIcon />
        </button>

        <h1 class="text-xl font-bold">
          Settings
        </h1>
      </header>

      <ul class="list">
        <li
          v-for="{name, label, icons} in secondaryNavItems"
          :key="name"
        >
          <router-link
            :to="{ name }"
            class="list-row"
          >
            <component :is="icons[currentRoute.name === name ? 'active' : 'inactive']" />
            {{ label }}
          </router-link>
        </li>
      </ul>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTemplateRef } from 'vue'
import { WlBackIcon, WlSettingIcon } from 'components/icons'
import type { NavItem } from './common'

const { primaryNavItems, secondaryNavItems } = defineProps<{ primaryNavItems: NavItem[], secondaryNavItems: NavItem[] }>()

const currentRoute = useRoute()

const settingDialog = useTemplateRef<HTMLDialogElement>('settings-dialog')
</script>
