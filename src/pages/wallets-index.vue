<template>
  <Ui.AppHeader :title="st('modelName', 2)" left="back">
    <template #right>
      <NewWalletDialog />
    </template>
  </Ui.AppHeader>

  <Ui.AppMain>
    <ul class="list">
      <li v-for="wallet in wallets" :key="wallet.id" class="list-row">
        <a>
          <div class="flex items-center gap-2">
            <span>{{ wallet.name }}</span>
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

const { api } = Common.useCommon()
const st = Common.useScopedTranslate('wallets')

const walletRepo = api.wallets

const { state: wallets } = useAsyncState(() => walletRepo.fetch(), undefined)
</script>
