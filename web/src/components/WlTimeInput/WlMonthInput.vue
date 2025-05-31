<template>
  <section class="flex justify-between">
    <select
      v-model="year"
      class="select select-ghost w-fit"
    >
      <option
        v-for="i in 10"
        :key="i"
        :value="dayjs().year() - 5 + i"
      >
        {{ dayjs().year() - 5 + i }}
      </option>
    </select>

    <div class="flex gap-2 items-center">
      <button
        class="btn btn-ghost btn-square"
        @click.prevent="() => {
          if (month > 0) {
            month--
          } else {
            month = 11
            year--
          }
        }"
      >
        <WlChevronLeftIcon />
      </button>

      {{ dayjs().month(month).format('MMMM') }}

      <button
        class="btn btn-ghost btn-square"
        @click.prevent="() => {
          if (month < 11) {
            month++
          } else {
            month = 0
            year++
          }
        }"
      >
        <WlChevronRightIcon />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { WlChevronLeftIcon, WlChevronRightIcon } from 'components/icons'

const year = defineModel<number>('year', { default: dayjs().year() })
const month = defineModel<number>('month', { default: dayjs().month() })
</script>
