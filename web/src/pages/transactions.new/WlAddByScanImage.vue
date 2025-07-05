<template>
  <form class="flex flex-col gap-4 p-2 items-center mt-8">
    <hgroup class="flex flex-col items-center">
      <WlCameraIconFilled class="size-30 fill-base-200" />
      <p>Quickly create a new transaction from images like bills, bank receipts, ...</p>
    </hgroup>

    <input
      type="file"
      class="file-input"
    >
  </form>
</template>

<script setup lang="ts">
import { WlCameraIconFilled } from 'components/icons'
</script>
