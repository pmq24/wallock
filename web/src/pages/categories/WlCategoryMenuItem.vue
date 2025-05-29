<template>
  <ul v-if="categories.length">
    <li
      v-for="category in categories"
      :key="category.id"
    >
      <RouterLink :to="{ name: 'categoriesIdEdit', params: { id: category.id } }">
        {{ category.shortName }}
      </RouterLink>

      <WlCategoryMenuItem
        :all-categories
        :parent="parent ? [parent, category.shortName].join('/') : category.shortName"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type Category from 'models/data/categories/Category'
import { computed } from 'vue'

const { allCategories, parent } = defineProps<{
  allCategories: Category[]
  parent?: string
}>()

const categories = computed(() => allCategories.filter(category => category.parent === (parent ?? '')))
</script>
