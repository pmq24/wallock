<template>
  <form
    id="new-transaction-form"
    :disabled="form.submitting"
    @submit.prevent="submitForm"
  >
    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">
        Wallet
      </legend>

      <select
        id="wallet-id-field"
        v-model="form.walletId"
        :disabled="form.submitting"
        class="select w-full"
      >
        <option
          v-for="wallet in form.availableWallets"
          :key="wallet.id"
          :value="wallet.id"
        >
          {{ wallet.name }}
        </option>
      </select>
    </fieldset>

    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">
        Amount
      </legend>

      <label
        class="input input-lg w-full"
        for="amount-field"
      >
        <span class="label">{{ form.wallet.currencyCode }}</span>

        <output
          for="amount-field wallet-id-field category-id-field"
          name="net-amount"
        >
          {{ form.netAmount }}
        </output>

        <input
          id="amount-field"
          v-model="form.amount"
          :disabled="form.submitting"
          type="number"
          inputmode="numeric"
          class="h-0"
        >
      </label>
    </fieldset>

    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">
        Category
      </legend>

      <select
        id="category-id-field"
        v-model="form.categoryId"
        :disabled="form.submitting"
        class="select w-full"
      >
        <option
          v-for="category in form.availableCategories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </fieldset>

    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">
        Time
      </legend>

      <WlTimeInput
        v-model="form.time"
        class="w-full"
      />
    </fieldset>

    <button
      :disabled="form.submitting"
      class="btn btn-primary btn-block mt-4"
    >
      <span
        v-if="form.submitting"
        class="loading loading-spinner"
      />
      Create
    </button>
  </form>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import WlTimeInput from 'components/WlTimeInput/WlTimeInput.vue'
import { useCommon } from 'common'

const { api, route, router } = useCommon()

const transactionService = api.transactionService

const form = reactive(await transactionService.createCreateForm())

watch(() => [form, route.query], () => {
  if (!form) return

  const { amount, categoryId, walletId, time } = route.query

  if (amount && !isNaN(+amount)) {
    form.amount = +amount
  }

  if (categoryId && typeof categoryId === 'string') {
    form.categoryId = categoryId
  }

  if (walletId && typeof walletId === 'string') {
    form.walletId = walletId
  }

  if (time && typeof time === 'string') {
    form.time = time
  }
})

async function submitForm () {
  const { success } = await form.submit()

  if (success) {
    router.push({ name: 'transactions' })
  }
}
</script>
