<template>
  <div class="size-fit">
    <label
      :for="day.toString()"
      :class="{ 'btn-ghost': !isToday && !isSelected, 'btn-primary': isSelected }"
      class="btn btn-square font-normal"
    >
      {{ day }}
    </label>
    <input
      :id="day.toString()"
      v-model="selectedTime"
      :value="value.format('YYYY-MM-DDTHH:mm:ss')"
      type="radio"
      class="size-0"
    >
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed } from 'vue'
const props = defineProps<{ year: number, month: number, day: number }>()

const selectedTime = defineModel<string>()
const value = computed(() => dayjs().year(props.year).month(props.month).date(props.day))

const isToday = computed(() => dayjs().isSame(value.value, 'day'))
const isSelected = computed(() => dayjs(selectedTime.value).isSame(value.value, 'day'))
</script>
