<template>
  <header class="navbar lg:w-xl lg:mx-auto prose">
    <h1>
      New Wallet
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <form @submit.prevent="submit">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Name
        </legend>
        <input
          v-model="data.name"
          class="input w-full validator"
          :disabled="isLoading"
          :aria-invalid="nameError ? 'true' : undefined"
        >
        <span class="validator-hint">{{ nameError }}</span>
      </fieldset>

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Curreny
        </legend>
        <input
          v-model="data.currencyCode"
          class="input w-full validator"
          list="currency-code-datalist"
          :disabled="isLoading"
          :aria-invalid="currencyCodeError ? 'true' : undefined"
        >
        <span class="validator-hint">{{ currencyCodeError }}</span>

        <datalist id="currency-code-datalist">
          <option
            v-for="currencyCode in Wallet.CURRENCY_CODES"
            :key="currencyCode"
            :value="currencyCode"
          >
            {{ currencyCode }}
          </option>
        </datalist>
      </fieldset>

      <button
        class="btn btn-block btn-primary mt-4"
        :disabled="isLoading"
      >
        <span
          v-if="isLoading"
          class="loading loading-spinner"
        />
        Create
      </button>
    </form>
  </main>
</template>

<script lang="ts" setup>
import Wallet from 'models/wallets/Wallet'
import WalletService from 'models/wallets/WalletService'
import { injectApi } from 'providers/api'
import { computed, reactive, ref } from 'vue'

const data = reactive<WalletService.CreateData>({
  name: '',
  currencyCode: 'USD',
})

const isLoading = ref(false)
const errors = ref<WalletService.CreateErrors>()
const nameError = computed(() => errors.value?.nested?.name?.at(0))
const currencyCodeError = computed(() => errors.value?.nested?.currencyCode?.at(0))

const walletService = injectApi().wallets
async function submit () {
  isLoading.value = true
  const validation = await walletService.create(data)
  errors.value = validation.errors
  isLoading.value = false
}
</script>
