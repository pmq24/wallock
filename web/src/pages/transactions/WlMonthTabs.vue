<template>
  <div
    ref="root"
    class="overflow-x-auto no-scrollbar"
  >
    <nav class="tabs tabs-border flex-nowrap">
      <WlLink
        v-for="({ label, query }) in periods"
        :key="label"
        :to="{ query: { ...route.query, ...query } }"
        :class="route.query.period === query.period && 'tab-active'"
        class="tab text-nowrap"
      >
        {{ label }}
      </WlLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useCommon } from 'common'
import dayjs from 'dayjs'
import WlLink from 'components/WlLink.vue'
import { onMounted, onUpdated, useTemplateRef, watch } from 'vue'

const { route, router } = useCommon()

const root = useTemplateRef<HTMLDivElement>('root')

watch(() => route.query.period, () => {
  if (!route.query.period) {
    router.push({ query: { period: dayjs().format('YYYY-MM') } })
  }
}, { immediate: true })

onMounted(() => {
  root.value?.scrollTo({ left: root.value.scrollWidth })
})

onUpdated(() => {
  root.value?.getElementsByClassName('tab-active').item(0)?.scrollIntoView({ behavior: 'smooth' })
})

const mostRecentMonths: string[] = []
for (let i = 0, day = dayjs(); i < 12; i++) {
  mostRecentMonths.push(day.format('YYYY-MM'))
  day = day.subtract(1, 'month')
}
const periods = [
  ...mostRecentMonths.reverse().map(i => ({ label: i, query: { period: i } })),
  { label: 'Future', query: { period: 'future' } }
]
</script>
