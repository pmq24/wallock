<template>
  <fieldset class="fieldset w-full">
    <legend class="fieldset-legend">
      Name
    </legend>

    <input
      v-model="model"
      :class="error && 'input-error'"
      class="input w-full"
    >
    <span
      v-if="error"
      class="text-error"
    >
      {{ error }}
    </span>
  </fieldset>
</template>

<script setup lang="ts">
const model = defineModel<string>()
const { error } = defineProps<{ error?: string }>()
</script>
