<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">{{ props.label }}</legend>
    <slot />
    <p v-if="props.error" class="label text-error">{{ props.error }}</p>
  </fieldset>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  labelFor?: string
  error?: string
}>()
</script>
