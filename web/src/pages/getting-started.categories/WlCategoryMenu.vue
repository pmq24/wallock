<template>
  <ul class="menu flex-nowrap w-full">
    <li>
      <h1 class="menu-title">
        {{ title }}
      </h1>
    </li>

    <ul>
      <WlCategoryMenuItem
        v-model="selected"
        :category-names
        :type
      />
    </ul>
  </ul>
</template>

<script setup lang="ts">
import WlCategoryMenuItem from './WlCategoryMenuItem.vue'
import type Category from 'models/data/categories/Category'
import categoryNamesToCreate from './categoryNamesToCreate'
import CategoryService from 'models/data/categories/CategoryService'

type Props = {
  title: string,
  type: Category.Type
}
const { title, type } = defineProps<Props>()

const categoryNames = categoryNamesToCreate[type]
const selected = defineModel<CategoryService.CreateData[]>()
</script>
