<template>
  <fieldset class="fieldset w-full">
    <legend class="fieldset-legend">
      Category
    </legend>

    <select
      v-model="categoryId"
      class="select w-full"
    >
      <option
        v-for="category in props.categories"
        :key="category.id"
        :value="category.id"
      >
        {{ category.fullName }}
      </option>
    </select>

    <span
      v-if="props.error"
      class="text-error"
    >{{ props.error }}</span>
  </fieldset>
</template>

<script setup lang="ts">
import type Category from 'models/data/categories/Category'

const categoryId = defineModel<string>()
const props = defineProps<{
  categories: Category[],
  error: string
}>()
</script>
