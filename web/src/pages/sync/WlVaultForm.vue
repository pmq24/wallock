<template>
  <form
    class="flex flex-col gap-2"
    @submit.prevent="submit"
  >
    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">
        Folder name
      </legend>

      <input
        class="input w-full"
        placeholder="Default: Wallock"
      >
    </fieldset>

    <button class="btn btn-primary btn-block">
      Create
    </button>
  </form>
</template>

<script setup lang="ts">
import type VaultService from 'models/sync/vaults/VaultService'
import { injectApi } from 'providers/api'
import { reactive } from 'vue'

const data = reactive<VaultService.CreateData>({ name: '' })

const api = injectApi()
const vaultService = api.vaultService

async function submit () {
  await vaultService.create(data)
}
</script>
