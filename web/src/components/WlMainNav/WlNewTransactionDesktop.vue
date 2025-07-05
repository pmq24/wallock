<template>
  <button
    popovertarget="new-transaction-methods"
    class="btn btn-primary w-fit"
  >
    <WlAddIcon />
    New transaction
  </button>

  <li
    id="new-transaction-methods"
    popover
    class="top-[anchor(bottom)] left-[anchor(left)] dropdown rounded-box bg-base-200 shadow-sm menu mt-1"
  >
    <WlLink :to="{ name: 'transactionsNew', query: { method: 'manual' } }">
      <WlKeyboardIcon /> Manually
    </WlLink>

    <WlLink :to="{ name: 'transactionsNew', query: { method: 'scan-image' } }">
      <WlCameraIcon /> Scan image
    </WlLink>
  </li>
</template>

<script setup lang="ts">
import WlLink from 'components/WlLink.vue'
import { WlAddIcon, WlKeyboardIcon, WlCameraIcon } from 'components/icons'
</script>
