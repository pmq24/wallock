<template>
  <div class="flex flex-col max-h-[100dvh] min-h-[100dvh]">
    <header class="lg:w-xl lg:mx-auto">
      <div class="navbar gap-2">
        <RouterLink
          :to="{ name: 'settings'}"
          class="btn btn-ghost btn-square"
        >
          <WlBackIcon />
        </RouterLink>

        <h1 class="text-xl font-bold flex-1">
          Categories
        </h1>

        <section class="dropdown dropdown-end">
          <button
            tabindex="0"
            :class="isSyncing && 'btn-disabled animate-pulse'"
            class="btn btn-square btn-ghost"
          >
            <WlSyncErrorIcon
              v-if="syncError"
              class="text-error"
            />
            <WlSyncIcon v-else />
          </button>

          <section
            tabindex="0"
            class="dropdown-content w-max p-4 shadow-md card flex flex-col gap-2"
          >
            <template v-if="syncError">
              <template v-if="syncError instanceof UnauthorizedError">
                Session has expired, please log in.

                <RouterLink
                  :to="{ name: 'sync'}"
                  class="btn btn-primary"
                >
                  Log in
                </RouterLink>
              </template>

              <span v-else>Something went wrong.</span>
            </template>

            <button
              v-else
              :class="isSyncing && 'btn-disabled'"
              class="btn btn-primary"
              @click="() => sync()"
            >
              {{ isSyncing ? "Syncing..." : "Sync now" }}
            </button>
          </section>
        </section>
      </div>

      <nav class="tabs p-2">
        <RouterLink
          v-for="navItemType in ['expense', 'income']"
          :key="navItemType"
          :to="{ query: { type: navItemType } }"
          :class="type === navItemType && 'tab-active'"
          class="tab"
          replace
        >
          {{ navItemType.at(0)!.toUpperCase() + navItemType.slice(1) }}
        </RouterLink>
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
        <RouterLink
          :to="{name: 'categoriesNew'}"
          class="btn btn-ghost"
        >
          <WlAddIcon />
          New category
        </RouterLink>
      </div>

      <RouterLink
        :to="{
          name: 'categoriesNew',
          query: { type }
        }"
        class="btn btn-primary btn-block mt-2"
      >
        New category
      </RouterLink>
    </main>
  </div>
</template>

<script lang="ts" setup>
import Category from 'models/data/categories/Category'
import { injectApi } from 'providers/api'
import { useRoute } from 'vue-router'
import { WlSyncIcon, WlSyncErrorIcon, WlBackIcon, WlAddIcon } from 'components/icons'
import { ref, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import WlCategoryMenu from './WlCategoryMenu.vue'
import { UnauthorizedError } from 'models/sync/errors'

const route = useRoute()

const api = injectApi()
const categoryService = api.categoryService
const syncer = api.syncer

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

const {
  execute: sync,
  error: syncError,
  isLoading: isSyncing
} = useAsyncState(() => syncer.syncCategories(), undefined, { immediate: false })
</script>
