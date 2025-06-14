<template>
  <header class="navbar lg:w-xl lg:mx-auto">
    <WlBackButton to-view="wallets" />

    <h1 class="text-xl font-bold flex-1">
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
          :class="nameError && 'input-error'"
          :disabled="isLoading"
          class="input w-full"
        >
        <span
          v-if="nameError"
          class="text-error"
        >{{ nameError }}</span>
      </fieldset>

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Curreny
        </legend>
        <input
          v-model="data.currencyCode"
          :class="currencyCodeError && 'input-error'"
          :disabled="isLoading"
          list="currency-code-datalist"
          class="input w-full"
        >
        <span
          v-if="currencyCodeError"
          class="text-error"
        >{{ currencyCodeError }}</span>

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
import Wallet from 'models/data/wallets/Wallet'
import WalletService from 'models/data/wallets/WalletService'
import { injectApi } from 'providers/api'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WlBackButton from 'components/WlBackButton.vue'

const router = useRouter()
const route = useRoute()

const data = reactive<WalletService.CreateData>({
  name: '',
  currencyCode: 'USD',
})

const isLoading = ref(false)
const errors = ref<WalletService.CreateErrors>()
const nameError = computed(() => errors.value?.nested?.name?.at(0))
const currencyCodeError = computed(() => errors.value?.nested?.currencyCode?.at(0))

const walletService = injectApi().walletService
async function submit () {
  isLoading.value = true
  const validation = await walletService.create(data)
  errors.value = validation.errors
  isLoading.value = false

  if (errors.value) {
    return
  }

  const redirectOnSuccess = route.query.redirectOnSuccess
  if (typeof redirectOnSuccess === 'string') {
    router.push({ name: redirectOnSuccess })
  } else {
    router.push({ name: 'wallets' })
  }
}
</script>
