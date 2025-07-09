<template>
  <WlNavbarTitle class="navbar lg:w-xl lg:mx-auto">
    <WlLink
      :to="{ name: 'transactions' }"
      class="btn btn-ghost btn-square"
    >
      <WlBackIcon />
    </WlLink>

    <WlNavbarTitle>
      New Transaction
    </WlNavbarTitle>
  </WlNavbarTitle>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <WlMethodTabs />

    <WlAddManually v-show="method === 'manual'" />
    <WlAddByScanImage v-show="method === 'scan-image'" />
  </main>
</template>

<script lang="ts" setup>
import { WlBackIcon } from 'components/icons'
import WlLink from 'components/WlLink.vue'
import WlNavbarTitle from 'components/WlNavbarTitle.vue'
import WlMethodTabs from './WlMethodTabs.vue'
import WlAddManually from './WlAddManually.vue'
import WlAddByScanImage from './WlAddByScanImage.vue'
import { computed } from 'vue'
import { useCommon } from 'common'

const { route } = useCommon()
const method = computed(() => route.query.method)
</script>
