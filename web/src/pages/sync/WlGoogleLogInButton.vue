<template>
  <a
    :href
    class="btn btn-block bg-white btn-lg text-black"
  >
    <WlGoogleIcon />
    Sync with Google Drive
  </a>
</template>

<script setup lang="ts">
import SyncService from 'models/sync/SyncService'
import { WlGoogleIcon } from 'components/icons'

const syncAppBaseUrl: string = import.meta.env.VITE_SYNC_APP_BASE_URL
const href = `${syncAppBaseUrl}/auth?redirect_uri=${SyncService.REDIRECT_URI}`
</script>
