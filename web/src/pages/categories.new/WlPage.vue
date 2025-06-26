<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <WlBackButton to-view="categories" />

    <h1 class="text-xl font-bold flex-1">
      New Category
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <form @submit.prevent="() => submit()">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Name
        </legend>

        <input
          v-model="data.name"
          :class="nameError && 'input-error'"
          class="input w-full"
        >
        <span
          v-if="nameError"
          class="text-error"
        >{{ nameError }}</span>
      </fieldset>

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Type
        </legend>

        <select
          v-model="data.type"
          :class="typeError && 'input-error'"
          class="input w-full"
        >
          <option value="expense">
            Expense
          </option>
          <option value="income">
            Income
          </option>
        </select>
        <span
          v-if="typeError"
          class="text-error"
        >{{ typeError }}</span>
      </fieldset>

      <button
        :disabled="!touched || !!error || isCreating"
        class="btn btn-primary btn-block mt-4"
      >
        <span
          v-if="isCreating"
          class="loading loading-spinner"
        />
        {{ isCreating ? "Creating..." : "Create" }}
      </button>
    </form>
  </main>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import WlBackButton from 'components/WlBackButton.vue'
import { useCommon } from 'common'
import { useAsyncState, watchDebounced } from '@vueuse/core'
import type CategoryCreator from 'models/data/categories/CategoryCreator'

const { api, router } = useCommon()

const categoryCreator = api.categoryService.creator

const data = reactive(categoryCreator.createInitialData())

const touched = ref(false)

const error = ref<CategoryCreator.Error>()
const typeError = computed(() => error.value?.get('type'))
const nameError = computed(() => error.value?.get('name'))
watchDebounced(data, async () => {
  error.value = await categoryCreator.getErrorIfInvalid(data)
  touched.value = true
})

const {
  execute: submit,
  isLoading: isCreating,
} = useAsyncState(
  () => categoryCreator.submitOrThrow(data),
  undefined,
  {
    immediate: false,
    onSuccess: () => router.push({ name: 'categories' }),
  }
)
</script>
