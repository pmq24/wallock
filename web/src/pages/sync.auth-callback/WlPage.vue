<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <h1 class="text-xl font-bold flex-1">
      {{ isLoading ? "Authenticating..." : failed ? "Authentication Failed" : "Authenticated" }}
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <div class="flex flex-col justify-center items-center gap-4">
      <span
        v-if="isLoading"
        class="loading loading-spinner"
      />

      <template v-else-if="failed">
        <div class="alert alert-error alert-soft alert-vertical w-full">
          <h1 class="font-bold">
            Something went wrong
          </h1>

          We have been notified and will look into this.
        </div>

        <WlLink
          :to="{ name: 'sync'}"
          class="btn btn-block"
        >
          Try again
        </WlLink>
      </template>

      <template v-else>
        You will be redirected shortly
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { injectApi } from 'providers/api'
import WlLink from 'components/WlLink.vue'

const router = useRouter()
const route = useRoute()

const api = injectApi()

const { state, code } = route.query

const { isLoading, error } = useAsyncState(() => {
  return api.authService.handleAuthCallback({ state: state?.toString() ?? '', code: code?.toString() ?? '' })
}, undefined)

const failed = ref(false)

watch([isLoading, error], function ([isLoading, error]) {
  if (isLoading) {
    return
  }

  if (error) {
    failed.value = true
    return
  }

  router.push({ name: 'sync' })
})
</script>
