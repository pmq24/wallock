<template>
  <form
    class="flex flex-col gap-4 p-2 items-stretch mt-8"
    @submit.prevent="() => submitForm()"
  >
    <div
      v-if="scanError"
      class="alert alert-error"
    >
      Failed to scan the image.
    </div>

    <output
      v-if="file"
      for="image"
    >
      <img
        :src="imageUrl"
        class="w-md mx-auto"
      >
    </output>
    <hgroup
      v-else
      class="flex flex-col items-center"
    >
      <WlCameraIconFilled class="size-30 fill-base-200" />
      <p>Quickly create a new transaction from images like bills, bank receipts, ...</p>
    </hgroup>

    <input
      id="image"
      :disabled="isScanning"
      type="file"
      accept="image/*"
      capture="environment"
      class="file-input w-full"
      @change="event => {
        const target = (event.target as HTMLInputElement)
        const files = target?.files
        if (files?.length) {
          file = files[0]
        }
      }"
    >

    <button
      :disabled="isScanning"
      class="btn btn-primary"
    >
      <div
        v-if="isScanning"
        class="loading loading-spinner"
      />
      Scan
    </button>
  </form>
</template>

<script setup lang="ts">
import { WlCameraIconFilled } from 'components/icons'
import { useCommon } from 'common'
import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

const { api, router } = useCommon()
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
    router.push({
      name: 'transactionsNew',
      query: {
        method: 'manual',
        amount: scanResult.amount,
        categoryId: scanResult.categoryId,
        walletId: scanResult.walletId,
        time: scanResult.time
      }
    })
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
