<template>
  <WlLink
    :to="{ name: toView }"
    class="btn btn-ghost btn-square"
  >
    <WlBackIcon />
  </WlLink>
</template>

<script setup lang="ts">
import WlLink from 'components/WlLink.vue'
import { WlBackIcon } from 'components/icons'
import type { PageName } from 'pages/router'
const { toView } = defineProps<{ toView: PageName }>()
</script>
