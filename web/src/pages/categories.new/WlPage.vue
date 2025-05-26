<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <button
      class="btn btn-ghost btn-square"
      @click="router.back"
    >
      <WlBackIcon />
    </button>
    <h1 class="text-xl font-bold flex-1">
      New Category
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <form @submit.prevent="submit">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Name
        </legend>

        <input
          v-model="data.name"
          class="input w-full validator"
          :disabled="isLoading"
          :aria-invalid="nameError ? 'true' : undefined"
        >
        <span
          v-if="nameError"
          class="validator-hint"
        >{{ nameError }}</span>
      </fieldset>

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Type
        </legend>

        <select
          v-model="data.type"
          class="select w-full"
          :disabled="isLoading"
          :aria-invalid="typeError ? 'true' : undefined"
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
          class="validator-hint"
        >{{ typeError }}</span>
      </fieldset>

      <button
        class="btn btn-primary btn-block mt-4"
        :disabled="isLoading"
      >
        <span
          v-if="isLoading"
          class="loading loading-spinner"
        />
        Create
      </button>
    </form>
  </main>
</template>

<script lang="ts" setup>
import type CategoryService from 'models/data/categories/CategoryService'
import { injectApi } from 'providers/api'
import { computed, reactive, ref } from 'vue'
import { WlBackIcon } from 'components/icons'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = reactive<CategoryService.CreateData>({
  name: '',
  type: 'expense'
})

const isLoading = ref(false)

const errors = ref<CategoryService.CreateErrors>()
const nameError = computed(() => errors.value?.nested?.name?.at(0))
const typeError = computed(() => errors.value?.nested?.type?.at(0))

const categoryService = injectApi().categoryService
async function submit () {
  isLoading.value = true
  const validation = await categoryService.create(data)
  errors.value = validation.errors
  router.push({ name: 'categories' })
  isLoading.value = false
}
</script>
