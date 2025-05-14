<template>
  <header class="navbar lg:w-xl lg:mx-auto">
    <button
      class="btn btn-ghost btn-square"
      @click="router.back"
    >
      <WlBackIcon />
    </button>

    <h1 class="text-xl font-bold flex-1">
      {{
        isLoading
          ? "Loading..."
          : wallet
            ? `Wallet: ${wallet.name}`
            : "Wallet not found"
      }}
    </h1>
  </header>

  <main
    v-if="wallet"
    class="p-2 lg:w-xl lg:mx-auto"
  >
    <ul class="list">
      <li class="list-row">
        <span class="list-col-grow">
          Currency
        </span>

        <span>{{ wallet?.currencyCode }}</span>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { WlBackIcon } from 'components/icons'
import { injectApi } from 'providers/api'
import { useAsyncState } from '@vueuse/core'

const router = useRouter()
const route = useRoute()
const api = injectApi()

const { state: wallet, isLoading } = useAsyncState(() => api.wallets.id(route.params.id as any), undefined)
</script>
