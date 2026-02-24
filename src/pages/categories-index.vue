<template>
  <Ui.AppHeader :title="st('name', 100)" left="back">
  </Ui.AppHeader>

  <Ui.AppMain>
    <ul class="menu">
      <categories-menu-with-children
        v-for="category in fetcher.root()"
        :key="category.id"
        :category="category"
        :category-fetcher="fetcher"
      />
    </ul>
  </Ui.AppMain>
</template>

<script setup lang="ts">
import * as Common from '@/common'
import * as Ui from '@/ui'
import CategoriesMenuWithChildren from './categories-index/categories-menu-with-children.vue'

const {
  api: {
    categories: { fetcher },
  },
} = Common.useCommon()
const st = Common.useScopedTranslate('categories')
</script>
