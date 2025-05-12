<template>
  <header class="navbar lg:w-xl lg:mx-auto prose">
    <h1>
      Wallets
    </h1>
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

const api = injectApi()
const wallets = await api.wallets.all()
</script>
