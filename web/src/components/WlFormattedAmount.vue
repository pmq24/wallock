<template>
  <span
    :class="amount === 0 ? false : amount > 0 ? 'text-success' : 'text-error'"
    class="font-mono"
  >
    {{ api.i18n.number(amount) }}
  </span>
</template>

<script setup lang="ts">
import { useCommon } from 'common'

const { amount } = defineProps<{ amount: number }>()

const { api } = useCommon()
</script>
