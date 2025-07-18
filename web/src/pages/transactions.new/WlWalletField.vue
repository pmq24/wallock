<template>
  <fieldset class="fieldset w-full">
    <legend class="fieldset-legend">
      Wallet
    </legend>

    <select
      v-model="walletId"
      class="select w-full"
    >
      <option
        v-for="wallet in wallets"
        :key="wallet.id"
        :value="wallet.id"
      >
        {{ wallet.name }}
      </option>
    </select>

    <span
      v-if="error"
      class="text-error"
    >{{ error }}</span>
  </fieldset>
</template>

<script setup lang="ts">
import type Wallet from 'models/data/wallets/Wallet'

const walletId = defineModel<string>()
const { wallets, error } = defineProps<{ wallets: Wallet[]; error?: string }>()
</script>
