<template>
  <header class="navbar lg:w-xl lg:mx-auto">
    <RouterLink
      :to="{ name: 'settings' }"
      class="btn btn-ghost btn-square"
    >
      <WlBackIcon />
    </RouterLink>
    <h1 class="text-xl font-bold flex-1">
      Wallets
    </h1>

    <RouterLink
      :to="{ name: 'walletsNew' }"
      class="btn btn-square btn-ghost"
    >
      <WlAddIcon />
    </RouterLink>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <ul class="list">
      <li
        v-for="wallet in wallets"
        :key="wallet.id"
      >
        <a
          :href="`/wallets/${wallet.id}`"
          class="list-row"
        >
          {{ wallet.name + ( wallet.isDefault ? ' (default)' : '' ) }}
        </a>
      </li>
    </ul>
  </main>
</template>

<script lang="ts" setup>
import { injectApi } from 'providers/api'
import { WlAddIcon, WlBackIcon } from 'components/icons'
import { useAsyncState } from '@vueuse/core'

const api = injectApi()
const { state: wallets } = useAsyncState(async () => api.wallets.all(), [])
</script>
