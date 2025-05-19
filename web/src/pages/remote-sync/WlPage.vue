<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <RouterLink
      :to="{ name: 'settings'}"
      class="btn btn-ghost btn-square"
    >
      <WlBackIcon />
    </RouterLink>
    <h1 class="text-xl font-bold flex-1">
      Remote Sync
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <a
      :href
      class="btn btn-block bg-white btn-lg text-black"
    >
      <WlGoogleIcon />
      Sync with Google Drive
    </a>
  </main>
</template>

<script setup lang="ts">
import { WlBackIcon, WlGoogleIcon } from 'components/icons'

const syncBaseUrl: string = import.meta.env.VITE_SYNC_APP_BASE_URL

const redirectUri = import.meta.env.VITE_BASE_URL + '/auth-callback'
const href = `${syncBaseUrl}/auth?redirect_uri=${redirectUri}`
</script>
