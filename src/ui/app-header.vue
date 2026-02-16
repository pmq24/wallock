<template>
  <header class="navbar gap-2">
    <button v-if="props.left === 'back'" @click="$router.back()" class="btn btn-ghost btn-square">
      <i class="pi pi-arrow-left" />
    </button>

    <h1 class="text-xl flex-1">{{ props.title }}</h1>

    <slot name="right" />
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  left?: 'back'
}>()
</script>
