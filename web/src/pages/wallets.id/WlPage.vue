<template>
  <header class="navbar lg:w-xl lg:mx-auto">
    <WlBackButton to-view="wallets" />

    <h1 class="text-xl font-bold flex-1">
      {{
        isLoading
          ? "Loading..."
          : wallet
            ? `Wallet: ${wallet.name} ${wallet.isDefault ? "(default)" : ""}`
            : "Wallet not found"
      }}
    </h1>
  </header>

  <main
    v-if="wallet"
    class="p-2 lg:w-xl lg:mx-auto flex flex-col gap-4"
  >
    <ul class="list">
      <li class="list-row">
        <span class="list-col-grow">
          Currency
        </span>

        <span>{{ wallet?.currencyCode }}</span>
      </li>
    </ul>

    <button
      :class="[ 'btn', 'btn-primary', wallet.isDefault && 'btn-disabled' ]"
      @click="makeDefault"
    >
      Make this wallet default
    </button>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import WlBackButton from 'components/WlBackButton.vue'
import { injectApi } from 'providers/api'
import { useAsyncState } from '@vueuse/core'

const route = useRoute()
const api = injectApi()

const { state: wallet, isLoading, execute: refetchWallet } = useAsyncState(() => api.walletService.id(route.params.id as any), undefined)

async function makeDefault () {
  if (!wallet.value?.id) {
    return
  }

  await api.walletService.makeDefault(wallet.value?.id)
  refetchWallet()
}
</script>
