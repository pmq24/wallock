<template>
  <RouterLink v-bind="props">
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
import type { PageName } from 'pages/router'
import type { RouterLinkProps } from 'vue-router'

const props = defineProps<RouterLinkProps & { to: RouterLinkProps['to'] & { name?: PageName } }>()
</script>
