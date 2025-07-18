<template>
  <fieldset class="fieldset w-full">
    <legend class="fieldset-legend">
      Amount
    </legend>

    <label
      class="input w-full"
      for="amount-field"
    >
      <span
        v-if="props.wallet"
        class="label"
      >{{ props.wallet.currencyCode }}</span>

      <output
        for="amount-field"
        name="net-amount"
      >
        {{ netAmount }}
      </output>

      <input
        id="amount-field"
        v-model="amount"
        type="number"
        inputmode="numeric"
        class="h-0"
      >
    </label>

    <span
      v-if="props.error"
      class="text-error"
    >{{ props.error }}</span>
  </fieldset>
</template>

<script setup lang="ts">
import type Wallet from 'models/data/wallets/Wallet'

const amount = defineModel<number>()
const props = defineProps<{
  wallet: Wallet | undefined,
  netAmount: string,
  error: string
}>()
</script>
