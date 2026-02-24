<template>
  <Ui.AppHeader :title="st('name', 100)" left="back">
  </Ui.AppHeader>

  <Ui.AppMain>
  </Ui.AppMain>

  <Ui.MainDock />
</template>

<script setup lang="ts">
import * as Ui from '@/ui'
import * as Common from '@/common'

const st = Common.useScopedTranslate('transactions')
</script>
