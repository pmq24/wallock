<template>
  <button
    v-bind="$attrs"
    class="input"
    @click.prevent="timePickerDialog?.showModal"
  >
    {{ displayValue }}
  </button>

  <dialog
    ref="time-picker-dialog"
    class="modal"
  >
    <div class="modal-box w-fit">
      <header>
        <h1 class="text-lg font-bold">
          Select date
        </h1>
      </header>

      <WlMonthInput
        v-model:month="monthInView"
        v-model:year="yearInView"
      />

      <section class="grid grid-cols-7 justify-center items-center p-2 gap-4 size-fit">
        <div
          v-for="weekday in 'SMTWTFS'.split('')"
          :key="weekday"
          class="size-10 flex justify-center items-center"
        >
          {{ weekday }}
        </div>

        <div
          v-for="i in cellsToSkipRender"
          :key="i"
        />

        <WlDayCell
          v-for="day in lastDay.date()"
          :key="day"
          v-model="selectedTime"
          :year="yearInView"
          :month="monthInView"
          :day="day"
        />
      </section>

      <footer class="modal-action">
        <button
          class="btn btn-ghost"
          @click.prevent="reset"
        >
          Reset
        </button>
        <button
          class="btn btn-primary"
          @click.prevent="() => timePickerDialog?.close()"
        >
          Done
        </button>
      </footer>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, ref, useTemplateRef } from 'vue'
import WlMonthInput from './WlMonthInput.vue'
import WlDayCell from './WlDayCell.vue'

const timePickerDialog = useTemplateRef('time-picker-dialog')

const selectedTime = defineModel<string>()

const displayValue = computed(() => {
  const selectedDayjs = dayjs(selectedTime.value)
  const diffInDays = dayjs().diff(selectedDayjs, 'day')
  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else {
    return selectedDayjs.format('YYYY, MMM D')
  }
})

const yearInView = ref(dayjs(selectedTime.value).year())
const monthInView = ref(dayjs(selectedTime.value).month())

const firstDay = computed(() => dayjs().year(yearInView.value).month(monthInView.value).startOf('month'))
const cellsToSkipRender = computed(() => firstDay.value.day())

const lastDay = computed(() => dayjs().year(yearInView.value).month(monthInView.value).endOf('month'))

function reset () {
  selectedTime.value = dayjs().format('YYYY-MM-DDTHH:mm:ss')
  timePickerDialog.value?.close()
}
</script>
