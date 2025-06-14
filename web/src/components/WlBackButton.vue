<template>
  <RouterLink
    :to="{ name: toView }"
    class="btn btn-ghost btn-square"
  >
    <WlBackIcon />
  </RouterLink>
</template>

<script setup lang="ts">
import { WlBackIcon } from 'components/icons'
const { toView } = defineProps<{ toView: string }>()
</script>
