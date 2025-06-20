<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2 mb-2">
    <WlLink
      :to="{ name: 'categories' }"
      class="btn btn-ghost btn-square"
    >
      <WlCloseIcon />
    </WlLink>

    <h1 class="text-xl font-bold flex-1">
      Edit Category
    </h1>

    <button
      form="category-update-form"
      class="btn btn-primary"
      :disabled="form?.isSubmitting"
    >
      Save
    </button>
  </header>

  <main
    v-if="isReady"
    class="p-2 lg:w-xl lg:mx-auto"
  >
    <section
      v-if="error"
      class="alert alert-error"
    >
      Something want wrong. Please try again later.
    </section>

    <section
      v-if="!form"
      class="flex flex-col justify-center items-center"
    >
      <h1>Category not found.</h1>

      <div class="flex justify-center items-center">
        <WlLink
          :to="{ name: 'categories' }"
          class="btn btn-sm btn-ghost"
        >
          Go back
        </WlLink>
      </div>
    </section>

    <form
      v-else
      id="category-update-form"
      @submit.prevent="submit"
    >
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Name
        </legend>

        <input
          v-model="form.name"
          :class="nameError && 'input-error'"
          :disabled="form.isSubmitting"
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
          v-model="form.type"
          class="select w-full"
          disabled
        >
          <option value="expense">
            Expense
          </option>
          <option value="income">
            Income
          </option>
        </select>
      </fieldset>
    </form>
  </main>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { WlCloseIcon } from 'components/icons'
import type CategoryUpdateForm from 'models/data/categories/CategoryUpdateForm'
import { ValidationError } from 'models/data/errors'
import { injectApi } from 'providers/api'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WlLink from 'components/WlLink.vue'

const router = useRouter()
const route = useRoute()
const id = Array.isArray(route.params.id) ? (route.params.id.at(0) ?? '') : route.params.id

const api = injectApi()
const categoryService = api.categoryService

const { state: form, isReady, error } = useAsyncState(() => categoryService.createUpdateForm(id), undefined)

const errors = ref<ValidationError<CategoryUpdateForm.Data>>()
const nameError = computed(() => errors.value?.messages.name)

async function submit () {
  if (!form.value) return

  try {
    await form.value.submit()

    router.push({ name: 'categories' })
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      errors.value = e
      return
    }

    throw e
  }
}
</script>
