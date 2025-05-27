<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <RouterLink
      :to="{ name: 'settings'}"
      class="btn btn-ghost btn-square"
    >
      <WlBackIcon />
    </RouterLink>

    <h1 class="text-xl font-bold flex-1">
      Categories
    </h1>

    <RouterLink
      :to="{ name: 'categoriesNew' }"
      class="btn btn-square btn-ghost"
    >
      <WlAddIcon />
    </RouterLink>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <nav class="tabs">
      <RouterLink
        v-for="navItemType in ['expense', 'income']"
        :key="navItemType"
        :class="['tab', type === navItemType && 'tab-active']"
        :to="{ query: { type: navItemType } }"
        replace
      >
        {{ navItemType.at(0)!.toUpperCase() + navItemType.slice(1) }}
      </RouterLink>
    </nav>

    <WlCategoryMenu
      v-if="isReady && categories.length > 0"
      :categories
    />

    <div
      v-else
      class="flex flex-col justify-center items-center gap-2 h-25"
    >
      <span>There are no categories</span>
      <RouterLink
        :to="{name: 'categoriesNew'}"
        class="btn btn-ghost"
      >
        <WlAddIcon />
        New category
      </RouterLink>
    </div>
  </main>
</template>

<script lang="ts" setup>
import Category from 'models/data/categories/Category'
import { injectApi } from 'providers/api'
import { useRoute } from 'vue-router'
import { WlAddIcon, WlBackIcon } from 'components/icons'
import { ref, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import WlCategoryMenu from './WlCategoryMenu.vue'

const route = useRoute()

const api = injectApi()
const { state: categories, isReady, execute: refetchCategories } = useAsyncState(
  () => api.categoryService.all().then(categories => categories.filter(category => category.type === type.value)),
  []
)

const type = ref<Category.Type>('expense')

watch(() => route.query.type, async (newType) => {
  if (Category.TYPES.includes(newType as any)) {
    type.value = newType as Category.Type
  } else {
    window.history.replaceState({}, '', '/categories?type=expense')
    type.value = 'expense'
  }

  refetchCategories()
}, { immediate: true })
</script>
