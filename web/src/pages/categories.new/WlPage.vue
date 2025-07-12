<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <WlBackButton to-view="categories" />

    <h1 class="text-xl font-bold flex-1">
      New Category
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <form @submit.prevent="() => submit()">
      <WlParentCategory
        v-model="data.parentId"
        :error="errors?.messages.parentId"
      />

      <WlNameInput
        v-model="data.name"
        :error="errors?.messages.name"
      />

      <button
        :disabled="isSubmitting"
        class="btn btn-primary btn-block mt-4"
      >
        Create
      </button>
    </form>
  </main>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import WlBackButton from 'components/WlBackButton.vue'
import { useCommon } from 'common'
import { useAsyncState } from '@vueuse/core'
import type CategoryCreator from 'models/data/categories/CategoryCreator'
import { ValidationError } from 'models/data/errors'
import WlNameInput from './WlNameInput.vue'
import WlParentCategory from './WlParentCategory.vue'

const { api, router } = useCommon()

const data = reactive({
  name: '',
  parentId: 'expense'
})

const errors = ref<CategoryCreator.Error>()

const { execute: submit, isLoading: isSubmitting } = useAsyncState(async () => {
  try {
    await api.categoryService.creator.create(data)
    errors.value = undefined
    router.push({ name: 'categories' })
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      errors.value = e
    } else {
      throw e
    }
  }
}, undefined, { immediate: false })
</script>
