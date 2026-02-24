<template>
  <li>
    <div>{{ category.name }}</div>
    <ul v-if="children.length > 0" class="menu">
      <li v-for="child in children" :key="child.id">
        <CategoriesMenuWithChildren :category="child" :category-fetcher="categoryFetcher" />
      </li>
    </ul>
  </li>
</template>

<script setup lang="ts">
import * as Categories from '@/api/categories'

const props = defineProps<{
  category: Categories.Category
  categoryFetcher: Categories.Fetcher
}>()

const children = props.categoryFetcher.childrenOf(props.category.id)
</script>
