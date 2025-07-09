<template>
  <details
    :open
    v-bind="$attrs"
  >
    <summary
      v-show="!open"
      class="btn btn-primary btn-lg"
      @click.prevent="open = !open"
    >
      <WlAddIcon />
      New transaction
    </summary>

    <nav class="flex flex-col items-end gap-2">
      <WlLink
        :to="{ name: 'transactionsNew', query: { method: 'manual' } }"
        class="btn w-fit"
      >
        <WlKeyboardIcon /> Manually
      </WlLink>

      <WlLink
        :to="{ name: 'transactionsNew', query: { method: 'scan-image' } }"
        class="btn w-fit"
      >
        <WlCameraIcon /> Scan image
      </WlLink>

      <button
        v-show="open"
        class="btn btn-secondary btn-circle"
        @click="open = false"
      >
        <WlCloseIcon />
      </button>
    </nav>
  </details>
</template>

<script setup lang="ts">
import WlLink from 'components/WlLink.vue'
import { WlAddIcon, WlKeyboardIcon, WlCameraIcon, WlCloseIcon } from 'components/icons'
import { ref } from 'vue'

const open = ref(false)
</script>
