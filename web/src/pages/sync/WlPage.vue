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
    v-if="vaultIsReady"
    class="p-2 lg:w-xl lg:mx-auto"
  >
    <template v-if="authService.isAuthenticated">
      <template v-if="vaultIsReady">
        <section v-if="vault">
          This vault is currently in sync with your Google Drive at
          <a
            :href="vault.url"
            class="link link-primary"
            target="_blank"
          >
            the {{ vault.name }} folder
            <WlOpenInNewTabIcon class="inline size-3 fill-primary" />
          </a>
        </section>

        <WlVaultForm v-else />
      </template>
    </template>

    <WlGoogleLogInButton v-else />
  </main>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { WlBackIcon, WlOpenInNewTabIcon } from 'components/icons'
import { injectApi } from 'providers/api'
import WlGoogleLogInButton from './WlGoogleLogInButton.vue'
import WlVaultForm from './WlVaultForm.vue'

const api = injectApi()
const authService = api.authService
const vaultService = api.vaultService

const { state: vault, isReady: vaultIsReady } = useAsyncState(async () => {
  if (!authService.isAuthenticated) {
    return undefined
  }

  return await vaultService.getRemote()
}, undefined)
</script>
