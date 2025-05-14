<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <button
      class="btn btn-ghost btn-square"
      @click="router.back"
    >
      <WlBackIcon />
    </button>

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
        :class="['tab', route.query.type === navItemType && 'tab-active']"
        :to="{ query: { type: navItemType } }"
        replace
      >
        {{ navItemType.at(0)!.toUpperCase() + navItemType.slice(1) }}
      </RouterLink>
    </nav>
    <ul class="list">
      <li
        v-for="category in categories"
        :key="category.id"
        class="list-row"
      >
        {{ category.name }}
      </li>
    </ul>
  </main>
</template>

<script lang="ts" setup>
import Category from 'models/categories/Category'
import { injectApi } from 'providers/api'
import { useRoute, useRouter } from 'vue-router'
import { WlAddIcon, WlBackIcon } from 'components/icons'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()

const api = injectApi()
const categories = ref<Category[]>([])

watch(() => route.query.type, async (type) => {
  let sanitizedType
  if (Category.TYPES.includes(type as any)) {
    sanitizedType = type
  } else {
    window.history.replaceState({}, '', '/categories?type=expense')
    sanitizedType = 'expense'
  }

  categories.value = await api.categories.all().then(categories => categories.filter(category => category.type === sanitizedType))
}, { immediate: true })
</script>
