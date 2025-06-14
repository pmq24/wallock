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
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <ul class="menu w-full">
      <li
        v-for="wallet in wallets"
        :key="wallet.id"
      >
        <a :href="`/wallets/${wallet.id}`">
          {{ wallet.name + ( wallet.isDefault ? ' (default)' : '' ) }}
        </a>
      </li>
    </ul>

    <RouterLink
      :to="{ name: 'walletsNew', }"
      class="btn btn-primary btn-block mt-2"
    >
      New wallet
    </RouterLink>
  </main>
</template>

<script lang="ts" setup>
import { injectApi } from 'providers/api'
import { useAsyncState } from '@vueuse/core'
import { WlBackIcon } from 'components/icons'

const api = injectApi()
const { state: wallets } = useAsyncState(async () => api.walletService.all(), [])

</script>
