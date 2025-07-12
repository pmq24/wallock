<template>
  <ul v-if="categories.length">
    <li
      v-for="category in categories"
      :key="category.id"
    >
      <div
        v-if="category.isSystem"
        class="tooltip tooltip-bottom"
        data-tip="This is a system category and cannot be edited"
      >
        {{ category.name }}
      </div>
      <WlLink
        v-else
        :to="{ name: 'categoriesIdEdit', params: { id: category.id } }"
      >
        {{ category.name }}
      </WlLink>

      <WlCategoryMenuItem
        :all-categories
        :parent-id="category.id"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type Category from 'models/data/categories/Category'
import { computed } from 'vue'
import WlLink from 'components/WlLink.vue'

const { allCategories, parentId } = defineProps<{
  allCategories: Category[]
  parentId: string
}>()

const categories = computed(() => allCategories.filter(category => category.parentId === parentId))
</script>
