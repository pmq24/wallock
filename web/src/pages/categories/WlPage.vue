<template>
  <div class="flex flex-col max-h-[100dvh] min-h-[100dvh]">
    <header class="lg:w-xl lg:mx-auto">
      <div class="navbar gap-2">
        <WlBackButton to-view="settings" />

        <h1 class="text-xl font-bold flex-1">
          Categories
        </h1>
      </div>

      <nav class="tabs p-2">
        <WlLink
          v-for="navItemType in ['expense', 'income']"
          :key="navItemType"
          :to="{ query: { type: navItemType } }"
          :class="type === navItemType && 'tab-active'"
          class="tab"
          replace
        >
          {{ navItemType.at(0)!.toUpperCase() + navItemType.slice(1) }}
        </WlLink>
      </nav>
    </header>

    <main class="p-2 lg:w-xl lg:mx-auto flex-auto overflow-y-auto">
      <WlCategoryMenu
        v-if="isReady && categories.length > 0"
        :categories
      />

      <div
        v-else
        class="flex flex-col justify-center items-center gap-2 h-25"
      >
        <span>There are no categories</span>
        <WlLink
          :to="{name: 'categoriesNew'}"
          class="btn btn-ghost"
        >
          <WlAddIcon />
          New category
        </WlLink>
      </div>

      <WlLink
        :to="{
          name: 'categoriesNew',
          query: { type }
        }"
        class="btn btn-primary btn-block mt-2"
      >
        New category
      </WlLink>
    </main>
  </div>
</template>

<script lang="ts" setup>
import Category from 'models/data/categories/Category'
import WlBackButton from 'components/WlBackButton.vue'
import { injectApi } from 'providers/api'
import { useRoute } from 'vue-router'
import { WlAddIcon } from 'components/icons'
import { ref, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import WlCategoryMenu from './WlCategoryMenu.vue'
import WlLink from 'components/WlLink.vue'

const route = useRoute()

const api = injectApi()
const categoryService = api.categoryService

const { state: categories, isReady, execute: refetchCategories } = useAsyncState(
  () => categoryService.all().then(categories => categories.filter(category => category.type === type.value)),
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
