<template>
  <button class="btn btn-ghost btn-square" @click="dialog?.showModal()">
    <i class="pi pi-plus" />
  </button>

  <dialog ref="new-wallet-dialog" closedby="any" class="modal">
    <form @submit.prevent="save()" class="modal-box">
      <header class="mb-6">
        <h2>{{ st('newForm.title') }}</h2>
      </header>

      <div class="flex flex-col gap-6">
        <Ui.InputContainer
          :label="st('name')"
          label-for="name"
          :error="result?.error?.nested?.name?.at(0)"
        >
          <input
            v-model="walletCreator.name"
            :placeholder="st('newForm.name.placeholder')"
            name="name"
            id="name"
            autocomplete="off"
            class="input w-full"
          />
        </Ui.InputContainer>

        <Ui.InputContainer
          :label="st('currency')"
          label-for="currencyCode"
          :error="result?.error?.nested?.currencyCode?.at(0)"
        >
          <select
            v-model="walletCreator.currencyCode"
            name="currencyCode"
            id="currencyCode"
            class="select w-full"
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
import { useAsyncState } from '@vueuse/core'

const dialog = useTemplateRef('new-wallet-dialog')

const {
  api: { wallets },
} = Common.useCommon()
const st = Common.useScopedTranslate('wallets')

const walletCreator = ref(wallets.creator())
const { state: result, execute: save } = useAsyncState(
  () => walletCreator.value.save(),
  undefined,
  { immediate: false },
)
</script>
