<template>
  <button
    class="btn btn-block"
    @click.prevent="scanImageDialog?.showModal"
  >
    <WlCameraIcon />
    Scan Image
  </button>

  <dialog
    ref="scan-image-dialog"
    class="modal"
  >
    <form class="modal-box flex flex-col gap-2 items-center">
      <hgroup class="flex flex-col items-center">
        <h1 class="font-bold text-lg">
          Scan Image
        </h1>
      </hgroup>

      <div
        v-if="scanError"
        class="alert alert-error"
      >
        Failed to scan the image.
      </div>

      <label
        for="image"
        class="w-md border-dashed border-base-300 border-2 rounded-lg p-2 flex flex-col justify-center items-center text-center"
      >
        <output
          v-if="file"
          for="image"
        >
          <img
            :src="imageUrl"
            class="w-full mx-auto"
          >
        </output>

        <hgroup
          v-else
          class="flex flex-col items-center"
        >
          <WlCameraIconFilled class="size-30 fill-base-200" />
          <p>Take photo or choose one from your gallery</p>
        </hgroup>

        <input
          id="image"
          :disabled="isScanning"
          type="file"
          accept="image/*"
          class="h-0"
          @change="event => {
            const target = (event.target as HTMLInputElement)
            const files = target?.files
            if (files?.length) {
              file = files[0]
            }
          }"
        >
      </label>

      <button
        :disabled="isScanning"
        class="btn btn-primary btn-block"
        @click.prevent="() => submitForm()"
      >
        <div
          v-if="isScanning"
          class="loading loading-spinner"
        />
        Scan
      </button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { WlCameraIcon, WlCameraIconFilled } from 'components/icons'
import { useCommon } from 'common'
import { computed, ref, useTemplateRef } from 'vue'
import { useAsyncState } from '@vueuse/core'
import type TransactionCreator from 'models/data/transactions/TransactionCreator'

const emit = defineEmits<{ scan: [ result: TransactionCreator.ScanResult ] }>()

const scanImageDialog = useTemplateRef<HTMLDialogElement>('scan-image-dialog')

const { api } = useCommon()
const transactionCreator = api.transactionService.creator

const file = ref<File>()
const imageUrl = computed(() => {
  if (file.value) {
    return URL.createObjectURL(file.value)
  }

  return undefined
})

const { execute: submitForm, isLoading: isScanning, error: scanError } = useAsyncState(() => scan(), undefined, { immediate: false })

async function scan () {
  if (file.value) {
    const imageBase64 = await encodeFileToBase64(file.value)
    const scanResult = await transactionCreator.scanImage(imageBase64)

    emit('scan', scanResult)
  }
}

async function encodeFileToBase64 (f: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64String = reader.result as string
      resolve(base64String.split(',').at(1)!)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(f)
  })
}
</script>
