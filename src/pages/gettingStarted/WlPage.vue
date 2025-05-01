<template>
  <header class="navbar prose">
    <h1>
      First, we need a few things
    </h1>
  </header>

  <main class="p-2">
    <form
      class=" flex flex-col gap-4"
      @submit.prevent="submit"
    >
      <div
        v-if="rootError"
        class="alert alert-error"
      >
        {{ rootError }}
      </div>

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Time zone
        </legend>
        <input
          v-model="settingData.timeZone"
          class="input w-full validator"
          placeholder="Choose your time zone"
          list="time-zone-datalist"
          :aria-invalid="timeZoneError ? 'true' : undefined"
          :disabled="isLoading"
        >
        <span
          v-if="timeZoneError"
          class="validator-hint"
        >{{ timeZoneError }}</span>

        <datalist id="time-zone-datalist">
          <option
            v-for="timeZone in Setting.TIME_ZONES"
            :key="timeZone"
            :value="timeZone"
          >
            {{ timeZone }}
          </option>
        </datalist>
      </fieldset>

      <button
        class="btn btn-primary btn-block"
        :disabled="isLoading"
      >
        <span
          v-if="isLoading"
          class="loading loading-spinner"
        />
        Next step
      </button>
    </form>
  </main>
</template>

<script lang="ts" setup>
import Setting from 'models/settings/Setting'
import { injectApi } from 'providers/api'
import { computed, reactive, ref } from 'vue'
import type SettingService from 'models/settings/SettingService'

const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const settingData = reactive<SettingService.CreateData>({
  timeZone: Setting.TIME_ZONES.includes(defaultTimeZone as any)
    ? defaultTimeZone as Setting.TimeZone
    : 'Asia/Saigon',
})

const errors = ref<SettingService.CreateErrors>()
const rootError = computed(() => errors.value?.root?.at(0))
const timeZoneError = computed(() => errors.value?.nested?.timeZone?.at(0))

const settingService = injectApi().settings
const isLoading = ref(false)
async function submit () {
  isLoading.value = true
  const result = await settingService.create(settingData)
  errors.value = result.errors
  isLoading.value = false
}
</script>
