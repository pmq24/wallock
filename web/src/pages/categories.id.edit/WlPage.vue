<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <WlBackButton to-view="categories" />

    <h1 class="text-xl font-bold flex-1">
      Edit Category
    </h1>
  </header>

  <main
    v-if="!isLoading"
    class="p-2 lg:w-xl lg:mx-auto"
  >
    <section
      v-if="!updateData?.updatable"
      class="alert alert-error"
    >
      {{ updateData?.reason }}
    </section>

    <form
      v-if="updateData?.updatable"
      @submit.prevent="() => submit()"
    >
      <WlParentCategory
        v-model="data.parentId"
        :category-id-being-edited="id"
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
        Update
      </button>
    </form>
  </main>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from 'vue'
import WlBackButton from 'components/WlBackButton.vue'
import { useCommon } from 'common'
import { computedAsync, useAsyncState } from '@vueuse/core'
import type CategoryCreator from 'models/data/categories/CategoryCreator'
import { ValidationError } from 'models/data/errors'
import WlNameInput from './WlNameInput.vue'
import WlParentCategory from './WlParentCategory.vue'

const { api, router, route } = useCommon()

const id = computed(() => Array.isArray(route.params.id) ? route.params.id.at(0)! : route.params.id)

const isLoading = shallowRef(false)
const updateData = computedAsync(() => api.categoryService.updater.getUpdateData(id.value), null, isLoading)

watch([updateData, isLoading], ([updateData, isLoading]) => {
  if (isLoading) {
    return
  }

  data.name = updateData?.category?.name ?? ''
  data.parentId = updateData?.category?.parentId ?? 'expense'
})

const data = reactive({
  name: '',
  parentId: 'expense'
})

const errors = ref<CategoryCreator.Error>()

const { execute: submit, isLoading: isSubmitting } = useAsyncState(async () => {
  try {
    await api.categoryService.updater.update({ id: id.value, ...data })
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
