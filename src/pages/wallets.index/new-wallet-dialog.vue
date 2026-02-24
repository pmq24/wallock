<template>
  <button class="btn btn-ghost btn-square" @click="dialog?.showModal()">
    <i class="pi pi-plus" />
  </button>

  <dialog ref="new-wallet-dialog" class="modal modal-bottom sm:modal-middle">
    <form @submit.prevent="save()" class="modal-box sm:h-auto">
      <header class="mb-6">
        <h2>{{ st('newForm.title') }}</h2>
      </header>

      <div class="flex flex-col gap-2">
        <Ui.InputContainer
          :label="st('props.name.label')"
          label-for="name"
          :error="result?.error?.nested?.name?.at(0)"
        >
          <input
            v-model="data.name"
            :placeholder="st('props.name.placeholder')"
            name="name"
            autocomplete="off"
            class="input w-full"
            :class="{ 'input-error': result?.error?.nested?.name?.at(0) }"
          />
        </Ui.InputContainer>

        <Ui.InputContainer
          :label="st('props.currency.label')"
          label-for="currencyCode"
          :error="result?.error?.nested?.currencyCode?.at(0)"
        >
          <select
            v-model="data.currencyCode"
            name="currencyCode"
            class="select w-full"
            :class="{ 'select-error': result?.error?.nested?.currencyCode?.at(0) }"
          >
            <option v-for="code in Currencies.CODES" :key="code" :value="code">
              {{ code }} ({{ Currencies.fromCode(code)!.symbol }})
            </option>
          </select>
        </Ui.InputContainer>
      </div>

      <footer class="modal-action">
        <button @click="dialog?.close()" type="button" class="btn btn-ghost">
          {{ $t('common.cancel') }}
        </button>

        <input type="submit" class="btn btn-ghost" :value="$t('common.save')" />
      </footer>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import * as Common from '@/common'
import * as Currencies from '@/api/wallets/currencies'
import * as Ui from '@/ui'
import * as Wallets from '@/api/wallets'
import { useAsyncState } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'created', wallet: Wallets.Wallet): void
}>()

const dialog = useTemplateRef('new-wallet-dialog')

const {
  api: { wallets: { creator: walletCreator } },
} = Common.useCommon()
const st = Common.useScopedTranslate('wallets')

const data = ref<Wallets.Creator.CreateData>({
  name: '',
  currencyCode: "USD",
})

const { state: result, execute: save } = useAsyncState(
  () => walletCreator.create(data.value),
  undefined,
  {
    immediate: false,
    onSuccess(result) {
      if (result?.ok) {
        dialog.value?.close()
        emit('created', result.wallet)
      }
    },
  },
)
</script>
