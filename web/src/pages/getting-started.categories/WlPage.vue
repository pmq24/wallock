<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <h1 class="text-xl font-bold flex-1">
      Select the categories you'll use
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <ul class="menu flex-nowrap max-h-[80vh] w-full overflow-y-scroll mb-4">
      <WlCategoryMenu
        v-model="selected"
        title="Income"
        type="income"
      />
      <WlCategoryMenu
        v-model="selected"
        title="Expense"
        type="expense"
      />
    </ul>

    <button
      :class="['btn btn-primary btn-block', isLoading && 'btn-disabled']"
      @click="submit"
    >
      Done
    </button>
  </main>
</template>

<script setup lang="ts">
import type Category from 'models/data/categories/Category'
import { injectApi } from 'providers/api'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import WlCategoryMenu from './WlCategoryMenu.vue'
import categoryNamesToCreate from './categoryNamesToCreate'
import { differenceWith, pullAllWith, isEqual } from 'lodash'

const selected = ref<{ name: string, type: Category.Type }[]>([
  ...categoryNamesToCreate.income.map(name => ({ name, type: 'income' as Category.Type })),
  ...categoryNamesToCreate.expense.map(name => ({ name, type: 'expense' as Category.Type })),
])

watch(selected, (newVal, oldVal) => {
  const unselected = differenceWith(oldVal, newVal, isEqual)

  selected.value = pullAllWith(selected.value, unselected, (stillSelected, unselected) => {
    return stillSelected.type === unselected.type && stillSelected.name.startsWith(unselected.name)
  })
})

const router = useRouter()

const api = injectApi()
const categoryService = api.categoryService

const isLoading = ref(false)
async function submit () {
  isLoading.value = true

  for (const category of selected.value) {
    await categoryService.create(category)
  }

  isLoading.value = false
  router.push({ name: 'transactions' })
}

</script>
