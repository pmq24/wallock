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

  <main class="p-2 lg:w-xl lg:mx-auto">
    <template v-if="syncService.isAuthenticated">
      <template v-if="isReady">
        <section v-if="vault">
          Id: {{ vault.remoteId }}
        </section>

        <WlVaultForm v-else />
      </template>
    </template>

    <WlGoogleLogInButton v-else />
  </main>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { WlBackIcon } from 'components/icons'
import { injectApi } from 'providers/api'
import WlGoogleLogInButton from './WlGoogleLogInButton.vue'
import WlVaultForm from './WlVaultForm.vue'

const api = injectApi()
const syncService = api.sync

const { state: vault, isReady } = useAsyncState(async () => {
  if (!syncService.isAuthenticated) {
    return undefined
  }

  return await syncService.getVault()
}, undefined)
</script>
