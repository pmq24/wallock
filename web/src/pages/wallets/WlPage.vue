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

    <section class="dropdown dropdown-end">
      <button
        tabindex="0"
        :class="isSyncing && 'btn-disabled animate-pulse'"
        class="btn btn-square btn-ghost"
      >
        <WlSyncErrorIcon
          v-if="syncError"
          class="text-error"
        />
        <WlSyncIcon v-else />
      </button>

      <section
        tabindex="0"
        class="dropdown-content w-max p-4 shadow-md card flex flex-col gap-2"
      >
        <template v-if="syncError">
          <template v-if="syncError instanceof UnauthorizedError">
            Session has expired, please log in.

            <RouterLink
              :to="{ name: 'sync'}"
              class="btn btn-primary"
            >
              Log in
            </RouterLink>
          </template>

          <span v-else>Something went wrong.</span>
        </template>

        <button
          v-else
          :class="isSyncing && 'btn-disabled'"
          class="btn btn-primary"
          @click="() => sync()"
        >
          {{ isSyncing ? "Syncing..." : "Sync now" }}
        </button>
      </section>
    </section>
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
import { UnauthorizedError } from 'models/sync/errors'
import { WlSyncIcon, WlSyncErrorIcon, WlBackIcon } from 'components/icons'

const api = injectApi()
const syncer = api.syncer
const { state: wallets } = useAsyncState(async () => api.walletService.all(), [])

const {
  execute: sync,
  error: syncError,
  isLoading: isSyncing
} = useAsyncState(() => syncer.syncWallets(), undefined, { immediate: false })
</script>
