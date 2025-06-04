<template>
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
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { injectApi } from 'providers/api'
import { UnauthorizedError } from 'models/sync/errors'
import { WlSyncErrorIcon, WlSyncIcon } from 'components/icons'
import { watch } from 'vue'

const api = injectApi()
const transactionSyncer = api.transactionSyncer

const { execute: sync, isLoading: isSyncing, error: syncError } = useAsyncState(() => transactionSyncer.sync(), undefined, { immediate: false })
watch(syncError, (error) => { throw error })
</script>
