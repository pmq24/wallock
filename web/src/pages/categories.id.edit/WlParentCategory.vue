<template>
  <fieldset class="fieldset w-full">
    <legend class="fieldset-legend">
      Parent
    </legend>

    <select
      v-model="model"
      :class="error && 'select-error'"
      class="select w-full"
    >
      <option
        v-for="option in parentOptions"
        :key="option.id"
        :value="option.id"
      >
        {{ option.fullName }}
      </option>
    </select>

    <span
      v-if="error"
      class="text-error"
    >
      {{ error }}
    </span>
  </fieldset>
</template>

<script setup lang="ts">
import { computedAsync } from '@vueuse/core'
import { useCommon } from 'common'

const model = defineModel<string>()
const { categoryIdBeingEdited, error } = defineProps<{
  error?: string,
  categoryIdBeingEdited: string
}>()

const { api } = useCommon()
const parentOptions = computedAsync(async () => {
  let categories
  categories = await api.categoryService.getAll()

  const categoryBeingEdited = categories.find(c => c.id === categoryIdBeingEdited)

  if (categoryBeingEdited) {
    const fullName = categoryBeingEdited.fullName
    const descendants = categories.filter(c => c.fullName.startsWith(fullName))
    categories = categories.filter(c => !descendants.includes(c))
  }

  return categories
})
</script>
