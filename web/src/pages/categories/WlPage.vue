<template>
  <div class="flex flex-col max-h-[100dvh] min-h-[100dvh]">
    <header class="lg:w-xl lg:mx-auto">
      <div class="navbar gap-2">
        <WlBackButton to-view="settings" />

        <WlNavbarTitle>
          Categories
        </WlNavbarTitle>
      </div>
    </header>

    <main class="p-2 lg:w-xl lg:mx-auto flex-auto overflow-y-auto">
      <WlCategoryMenu
        v-if="!isLoading && categories.length > 0"
        :categories
      />

      <div
        v-else
        class="flex flex-col justify-center items-center gap-2 h-25"
      >
        There are no categories
      </div>

      <WlLink
        :to="{ name: 'categoriesNew' }"
        class="btn btn-primary btn-block mt-2"
      >
        New category
      </WlLink>
    </main>
  </div>
</template>

<script lang="ts" setup>
import WlBackButton from 'components/WlBackButton.vue'
import WlCategoryMenu from './WlCategoryMenu.vue'
import WlLink from 'components/WlLink.vue'
import { useAsyncState } from '@vueuse/core'
import { useCommon } from 'common'
import WlNavbarTitle from 'components/WlNavbarTitle.vue'

const { api } = useCommon()

const { state: categories, isLoading } = useAsyncState(async () => {
  return await api.categoryService.getAll()
}, [])
</script>
