<template>
  <WlNavbarTitle>
    Ballance: <WlFormattedAmount
      v-if="!isCalculating"
      :amount="balance"
    />
  </WlNavbarTitle>
</template>

<script setup lang="ts">
import { computedAsync } from '@vueuse/core'
import { useCommon } from 'common'
import { computed, shallowRef } from 'vue'
import WlFormattedAmount from 'components/WlFormattedAmount.vue'
import WlNavbarTitle from 'components/WlNavbarTitle.vue'

const { api, route } = useCommon()
const transactionService = api.transactionService

const isCalculating = shallowRef(false)

const transactions = computedAsync(
  () => transactionService.query.query({ ...route.query, period: 'to-today' }),
  [],
  isCalculating
)

const balance = computed(() => transactions.value?.reduce((acc, t) => acc + t.netAmountFloat, 0))
</script>
