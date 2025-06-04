<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <RouterLink
      :to="{ name: 'settings'}"
      class="btn btn-ghost btn-square"
    >
      <WlBackIcon />
    </RouterLink>
    <h1 class="text-xl font-bold flex-1">
      Sync
    </h1>
  </header>

  <main
    class="p-2 lg:w-xl lg:mx-auto"
  >
    <template v-if="authService.isAuthenticated">
      <template v-if="rootFolderIsReady">
        <section v-if="rootFolder">
          This vault is currently in sync with your Google Drive at
          <a
            :href="'https://drive.google.com/drive/folders/' + rootFolder.id"
            class="link link-primary"
            target="_blank"
          >
            the {{ rootFolder.name }} folder!
            <WlOpenInNewTabIcon class="inline size-3 fill-primary" />
          </a>
        </section>
      </template>
    </template>

    <WlGoogleLogInButton v-else />
  </main>
</template>

<script setup lang="ts">
import { WlBackIcon, WlOpenInNewTabIcon } from 'components/icons'
import { injectApi } from 'providers/api'
import WlGoogleLogInButton from './WlGoogleLogInButton.vue'
import { useAsyncState } from '@vueuse/core'

const api = injectApi()
const authService = api.authService
const rootFolderService = api.rootFolderService

const { state: rootFolder, isReady: rootFolderIsReady } = useAsyncState(() => rootFolderService.get(), undefined)
</script>
