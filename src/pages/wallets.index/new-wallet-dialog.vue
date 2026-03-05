<template>
  <button
    @click="dialog?.showModal()"
    class="btn btn-ghost btn-square"
  >
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
          :error="validation?.error?.name"
        >
          <input
            v-model="data.name"
            :placeholder="st('props.name.placeholder')"
            name="name"
            autocomplete="off"
            class="input w-full"
            :class="{ 'input-error': !!validation?.error?.name }"
          />
        </Ui.InputContainer>
      </div>

      <footer class="modal-action">
        <button @click="dialog?.close()" type="button" class="btn btn-ghost">
          {{ $t('common.cancel') }}
        </button>

        <input :disabled="!validation?.ok" type="submit" class="btn btn-ghost" :value="$t('common.save')" />
      </footer>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import * as Common from '@/common'
import * as Ui from '@/ui'
import * as Wallets from '@/api/wallets'
import { useAsyncState, watchDebounced } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'created', wallet: Wallets.Wallet): void
}>()

const dialog = useTemplateRef('new-wallet-dialog')

const {
  api: { wallets: { creator: walletCreator } },
} = Common.useCommon()
const st = Common.useScopedTranslate('wallets')

const data = ref<Wallets.Creator.CreateData>({ name: '' })

const { state: validation, execute: validate } = useAsyncState(
  () => walletCreator.validate(data.value),
  undefined,
  {
    immediate: false,
  },
)

watchDebounced(data, () => { validate() }, { deep: true })

const { state: result, execute: save } = useAsyncState(
  () => walletCreator.create(data.value),
  undefined,
  {
    immediate: false,
    onSuccess(result) {
      if (result?.ok) {
        dialog.value?.close()
        data.value = { name: '' }
        emit('created', result.data)
      }
    },
  },
)
</script>
