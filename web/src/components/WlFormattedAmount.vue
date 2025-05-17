<template>
  <span :class="['font-mono', amount === 0 ? false : amount > 0 ? 'text-success' : 'text-error']">{{ api.i18n.number(amount) }}</span>
</template>

<script setup lang="ts">
import { injectApi } from 'providers/api'
const { amount } = defineProps<{ amount: number }>()
const api = injectApi()
</script>
