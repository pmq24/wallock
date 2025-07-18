<template>
  <WlNavbarTitle class="navbar lg:w-xl lg:mx-auto">
    <WlLink
      :to="{ name: 'transactions' }"
      class="btn btn-ghost btn-square"
    >
      <WlBackIcon />
    </WlLink>

    <WlNavbarTitle>
      New Transaction
    </WlNavbarTitle>
  </WlNavbarTitle>

  <main class="p-2 lg:w-xl lg:mx-auto flex flex-col gap-2">
    <WlScanImage
      @scan="scanResult => {
        if (scanResult.amount) form = form.setAmount(scanResult.amount)
        if (scanResult.categoryId) form = form.setCategoryId(scanResult.categoryId)
        if (scanResult.walletId) form = form.setWalletId(scanResult.walletId)
        if (scanResult.time) form = form.setTime(scanResult.time)
      }"
    />

    <form>
      <WlWalletField
        :model-value="form.getWalletId()"
        :wallets="form.getWallets()"
        :error="form.getWalletError()"
        @update:model-value="walletId => form = form.setWalletId(walletId ?? '')"
      />

      <WlAmountField
        :model-value="form.getAmount()"
        :net-amount="form.getNetAmount()"
        :wallet="form.getWallet()"
        :error="form.getAmountError()"
        @update:model-value="amount => form = form.setAmount(amount ?? 0)"
      />

      <WlCategoryField
        model-value="form.getCategoryId()"
        :categories="form.getCategories()"
        :error="form.getCategoryError()"
        @update:model-value="categoryId => form = form.setCategoryId(categoryId ?? '')"
      />

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Time
        </legend>

        <WlTimeInput
          :model-value="form.getTime()"
          class="w-full"
          @update:model-value="v => form = form.setTime(v ?? '')"
        />
      </fieldset>

      <button
        :disabled="isCreating"
        :class="isCreating && 'btn-disabled'"
        class="btn btn-primary btn-block mt-4"
        @click.prevent="() => submitForm()"
      >
        Create
      </button>
    </form>
  </main>
</template>

<script lang="ts" setup>
import { WlBackIcon } from 'components/icons'
import WlLink from 'components/WlLink.vue'
import WlNavbarTitle from 'components/WlNavbarTitle.vue'
import { ref } from 'vue'
import WlTimeInput from 'components/WlTimeInput/WlTimeInput.vue'
import { useCommon } from 'common'
import { useAsyncState } from '@vueuse/core'
import WlWalletField from './WlWalletField.vue'
import WlAmountField from './WlAmountField.vue'
import WlCategoryField from './WlCategoryField.vue'
import WlScanImage from './WlScanImage.vue'

const { api, router } = useCommon()

const transactionService = api.transactionService

const form = ref(await transactionService.createCreateForm())

const {
  isLoading: isCreating,
  execute: submitForm
} = useAsyncState(
  async () => {
    form.value = await form.value.create()
    if (form.value.getIsCreate()) {
      router.push({ name: 'transactions' })
    }
  },
  undefined,
  { immediate: false }
)
</script>
