<template>
  <div class="flex flex-col gap-1">
    <label class="label" :for="props.labelFor">{{ props.label }}</label>
    <slot />
    <span v-if="props.error" class="text-error text-sm">{{ props.error }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  labelFor?: string
  error?: string
}>()
</script>
