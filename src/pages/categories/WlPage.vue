<template>
  <header class="navbar lg:w-xl lg:mx-auto prose">
    <h1>
      Categories
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <nav class="tabs">
      <a
        v-for="navItemType in ['expense', 'income']"
        :key="navItemType"
        :class="['tab', type === navItemType && 'tab-active']"
        :href="`?type=${navItemType}`"
      >
        {{ navItemType.at(0)!.toUpperCase() + navItemType.slice(1) }}
      </a>
    </nav>
    <ul class="list">
      <li
        v-for="category in categories"
        :key="category.id"
      >
        <a
          :href="`/categories/${category.id}`"
          class="list-row"
        >
          {{ category.name }}
        </a>
      </li>
    </ul>
  </main>
</template>

<script lang="ts" setup>
import Category from 'models/categories/Category'
import { injectApi } from 'providers/api'

const qs = new URLSearchParams(window.location.search)
let type = qs.get('type')
if (!Category.TYPES.includes(type as any)) {
  type = 'expense'
  window.history.replaceState(null, '', `/categories?type=${type}`)
}

const api = injectApi()
const categories = (await api.categories.all()).filter(category => category.type === type)
</script>
