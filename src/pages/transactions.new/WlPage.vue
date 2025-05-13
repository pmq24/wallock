<template>
  <header class="navbar lg:w-xl lg:mx-auto prose">
    <h1>
      New Transaction
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <form
      id="new-transaction-form"
      :disabled="form.submitting"
      @submit.prevent="form.submit"
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

        <input
          v-model="form.time"
          step="1"
          type="datetime-local"
          class="input w-full"
        >
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
  </main>
</template>

<script lang="ts" setup>
import { injectApi } from 'providers/api'
import { reactive } from 'vue'

const api = injectApi()
const transactionService = api.transactions
const form = reactive(await transactionService.creationForm())
</script>
