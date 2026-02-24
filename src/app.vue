<template>
  <RouterView v-if="initialized" />
</template>

<script setup lang="ts">
import * as Common from '@/common'
import { useAsyncState } from '@vueuse/core'

const { api } = Common.useCommon()

const { isReady: initialized } = useAsyncState(() => api.init(), undefined)
</script>
