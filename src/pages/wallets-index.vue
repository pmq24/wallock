<template>
  <Ui.AppHeader :title="st('name', 2)" left="back">
    <template #right>
      <NewWalletDialog @created="reload()" />
    </template>
  </Ui.AppHeader>

  <Ui.AppMain>
    <ul class="list">
      <li v-for="wallet in wallets" :key="wallet.id" class="list-row">
        <a>
          <div class="flex items-center gap-2">
            <div>
              <div>{{ wallet.name }}</div>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </Ui.AppMain>
</template>

<script setup lang="ts">
import * as Common from '@/common'
import * as Ui from '@/ui'
import { useAsyncState } from '@vueuse/core'
import NewWalletDialog from './wallets.index/new-wallet-dialog.vue'

const {
  api: {
    wallets: { fetcher: walletFetcher },
  },
} = Common.useCommon()
const st = Common.useScopedTranslate('wallets')

const { state: wallets, execute: reload } = useAsyncState(() => walletFetcher.all(), undefined)
</script>
