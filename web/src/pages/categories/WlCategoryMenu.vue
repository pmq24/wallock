<template>
  <ul class="menu flex-nowrap w-full">
    <WlCategoryMenuItem
      :all-categories="props.categories"
    />
  </ul>
</template>

<script setup lang="ts">
import WlCategoryMenuItem from './WlCategoryMenuItem.vue'
import type Category from 'models/data/categories/Category'

const props = defineProps<{ categories: Category[] }>()
</script>
