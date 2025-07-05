<template>
  <nav class="tabs tabs-box">
    <WlLink
      v-for="tab in tabs"
      :key="tab.method"
      :to="{ name: 'transactionsNew', query: { method: tab.method } }"
      :class="tab.isActive && 'tab-active'"
      class="tab grow gap-2"
    >
      <component :is="tab.isActive ? tab.icons.active : tab.icons.inactive" />
      {{ tab.label }}
    </WlLink>
  </nav>
</template>

<script lang="ts" setup>
import { useCommon } from 'common'
import { computed, watch } from 'vue'
import WlLink from 'components/WlLink.vue'
import { WlCameraIcon, WlCameraIconFilled, WlKeyboardIcon, WlKeyboardIconFilled } from 'components/icons'

const { router, route } = useCommon()
const method = computed(() => route.query.method)
watch(method, (m) => {
  const methodNotSpecified = !m
  const methodIsInvalid = typeof m !== 'string' || !['manual', 'scan-image'].includes(m)
  if (methodNotSpecified || methodIsInvalid) {
    router.push({ query: { method: 'manual' } })
  }
}, { immediate: true })

const tabs = computed(() => [
  {
    label: 'Manual',
    method: 'manual',
    isActive: method.value === 'manual',
    icons: {
      active: WlKeyboardIconFilled,
      inactive: WlKeyboardIcon
    } as const
  } as const,
  {
    label: 'Scan image',
    method: 'scan-image',
    isActive: method.value === 'scan-image',
    icons: {
      active: WlCameraIconFilled,
      inactive: WlCameraIcon
    } as const
  } as const,
])
</script>
