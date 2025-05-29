<template>
  <ul v-if="names.length">
    <li
      v-for="name in names"
      :key="name"
    >
      <label>
        <input
          v-model="selected"
          :value="{name, type}"
          class="checkbox"
          type="checkbox"
        >
        {{ name.split("/").at(-1) }}
      </label>

      <WlCategoryMenuItem
        v-model="selected"
        :category-names
        :group="group ? [group, name.split('/').at(-1)].join('/') : name"
        :type
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type Category from 'models/data/categories/Category'
import type CategoryService from 'models/data/categories/CategoryService'

const { group, categoryNames } = defineProps<{
  group?: string;
  categoryNames: string[]
  type: Category.Type
}>()

const selected = defineModel<CategoryService.CreateData[]>()

const names = categoryNames.filter(name => {
  if (!group) {
    return !name.includes('/')
  } else {
    return name.startsWith(group) && name.split('/').length === group.split('/').length + 1
  }
})
</script>
