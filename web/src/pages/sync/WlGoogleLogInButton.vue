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
import { WlGoogleIcon } from 'components/icons'
import AuthService from 'models/sync/AuthService'

const syncAppBaseUrl: string = import.meta.env.VITE_SYNC_APP_BASE_URL
const href = `${syncAppBaseUrl}/auth?redirect_uri=${AuthService.REDIRECT_URI}`
</script>
