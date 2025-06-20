<template>
  <header class="navbar lg:w-xl lg:mx-auto">
    <WlBackButton to-view="settings" />

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

    <WlLink
      :to="{ name: 'walletsNew' }"
      class="btn btn-primary btn-block mt-2"
    >
      New wallet
    </WlLink>
  </main>
</template>

<script lang="ts" setup>
import { injectApi } from 'providers/api'
import { useAsyncState } from '@vueuse/core'
import WlBackButton from 'components/WlBackButton.vue'
import WlLink from 'components/WlLink.vue'

const api = injectApi()
const { state: wallets } = useAsyncState(async () => api.walletService.all(), [])

</script>
