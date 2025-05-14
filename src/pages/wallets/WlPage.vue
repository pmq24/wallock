<template>
  <header class="navbar lg:w-xl lg:mx-auto">
    <button
      class="btn btn-ghost btn-square"
      @click="router.back"
    >
      <WlBackIcon />
    </button>
    <h1 class="text-xl font-bold flex-1">
      Wallets
    </h1>

    <RouterLink
      :to="{ name: 'walletsNew' }"
      class="btn btn-square btn-ghost"
    >
      <WlAddIcon />
    </RouterLink>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <ul class="list">
      <li
        v-for="wallet in wallets"
        :key="wallet.id"
      >
        <a
          :href="`/wallets/${wallet.id}`"
          class="list-row"
        >
          {{ wallet.name }}
        </a>
      </li>
    </ul>
  </main>
</template>

<script lang="ts" setup>
import { injectApi } from 'providers/api'
import { useRouter } from 'vue-router'
import { WlAddIcon, WlBackIcon } from 'components/icons'

const router = useRouter()

const api = injectApi()
const wallets = await api.wallets.all()
</script>
