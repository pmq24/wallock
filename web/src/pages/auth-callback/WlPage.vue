<template>
  <header class="navbar lg:w-xl lg:mx-auto gap-2">
    <h1 class="text-xl font-bold flex-1">
      {{ isFetching ? "Authenticating..." : failed ? "Authentication Failed" : "Authenticated" }}
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <div class="flex flex-col justify-center items-center gap-4">
      <span
        v-if="isFetching"
        class="loading loading-spinner"
      />

      <template v-else-if="failed">
        <div class="alert alert-error alert-soft alert-vertical w-full">
          <h1 class="font-bold">
            Something went wrong
          </h1>

          We have been notified and will look into this.
        </div>

        <RouterLink
          :to="{ name: 'remoteSync'}"
          class="btn btn-block"
        >
          Try again
        </RouterLink>
      </template>

      <template v-else>
        You will be redirected shortly
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useFetch, useStorage } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as v from 'valibot'

const router = useRouter()
const route = useRoute()

const { state, code } = route.query
const syncBaseUrl: string = import.meta.env.VITE_SYNC_APP_BASE_URL
const redirectUri = import.meta.env.VITE_BASE_URL + '/auth-callback'
const url = `${syncBaseUrl}/auth-callback?code=${code}&redirect_uri=${redirectUri}&state=${state}`
const { isFetching, error: fetchError, data } = useFetch(url, { credentials: 'include' })

const failed = ref(false)

watch([isFetching, fetchError, data,], function ([isFetching, fetchError, data]) {
  if (isFetching) {
    return
  }

  if (fetchError) {
    failed.value = true
    return
  }

  if (typeof data !== 'string') {
    failed.value = true
    return
  }

  const jsoned = JSON.parse(data)

  const schema = v.object({
    access_token: v.string()
  })
  const validation = v.safeParse(schema, jsoned)
  if (!validation.success) {
    failed.value = true
    return
  }

  useStorage('accessToken', validation.output.access_token)
  router.push({ name: 'remoteSync' })
})
</script>
