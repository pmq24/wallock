<template>
  <WlMainNav>
    <header class="navbar lg:w-xl lg:mx-auto">
      <h1 class="flex-grow-1">
        Transactions
      </h1>

      <button
        v-if="walletsAreReady"
        class="btn"
        @click="() => walletSelector?.showModal()"
      >
        <WlWalletIcon />
        {{ query.walletFilter?.name }}
        <WlUnfoldIcon class="size-4" />
      </button>
      <dialog
        ref="wallet-selector"
        class="modal"
        closeBy="any"
      >
        <section class="modal-box">
          <header class="navbar">
            <button
              class="btn btn-ghost btn-square mr-2"
              @click="() => walletSelector?.close()"
            >
              <WlCloseIcon />
            </button>

            <h1 class="text-lg font-bold">
              Filter by wallet
            </h1>
          </header>

          <ul class="menu w-full">
            <li
              v-for="wallet in wallets"
              :key="wallet.id"
            >
              <RouterLink :to="{ query: { ...route.query, walletId: wallet.id } }">
                {{ wallet.name }}
              </RouterLink>
            </li>
          </ul>
        </section>
      </dialog>
    </header>

    <main class="p-2 lg:w-xl lg:mx-auto flex flex-col gap-2">
      <div
        v-if="visibleMonthsAreReady"
        class="overflow-x-auto"
      >
        <nav class="tabs">
          <RouterLink
            v-for="month in visibleMonths"
            :key="month"
            :class="['tab', query.periodFilter === month && 'tab-active']"
            :to="{ query: { ...route.query, period: month } }"
          >
            {{ month }}
          </RouterLink>
        </nav>
      </div>

      <section class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <h1 class="card-title">
            Overview
          </h1>

          <template
            v-for="( item, index ) in overview"
            :key="index"
          >
            <div
              v-if="item === 'divider'"
              class="divider my-0"
            />
            <div
              v-else
              class="flex justify-between items-center"
            >
              <span>{{ item.label }}</span>
              <WlFormattedAmount :amount="item.amount" />
            </div>
          </template>
        </div>
      </section>

      <div
        v-if="transactionsAreReady && !transactions.length"
        class="flex flex-col justify-center items-center gap-2 h-25"
      >
        <span>There are no transaction</span>
        <RouterLink
          :to="{name: 'transactionsNew'}"
          class="btn btn-ghost"
        >
          <WlAddIcon />
          New transaction
        </RouterLink>
      </div>

      <section
        v-for="([day, transactionsInDay]) in transactionsGroupedByDay"
        :key="day"
        class="card"
      >
        <div class="card-body">
          <header class="flex">
            <h1 class="card-title flex-grow-1">
              {{ day.slice(8) }}
            </h1>

            <WlFormattedAmount
              :amount="balancesByDay.get(day) ?? 0"
              class="font-bold"
            />
          </header>

          <ul class="list">
            <li
              v-for="transaction in transactionsInDay"
              :key="transaction.id"
            >
              <article class="list-row pr-0">
                <header class="list-col-grow">
                  {{ transaction.category.name }}
                </header>

                <WlFormattedAmount :amount="transaction.netAmountFloat" />
              </article>
            </li>
          </ul>
        </div>
      </section>
    </main>
  </WlMainNav>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { injectApi } from 'providers/api'
import WlMainNav from 'components/WlMainNav/WlMainNav.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, useTemplateRef, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { groupBy } from 'lodash'
import { WlAddIcon, WlCloseIcon, WlUnfoldIcon, WlWalletIcon } from 'components/icons'
import WlFormattedAmount from 'components/WlFormattedAmount.vue'

const router = useRouter()
const route = useRoute()

const api = injectApi()
const transactionService = api.transactionService
const walletService = api.walletService

const { state: wallets, isReady: walletsAreReady } = useAsyncState(() => walletService.all(), [])
const { state: visibleMonths, isReady: visibleMonthsAreReady } = useAsyncState(() => transactionService.visibleMonths(), [])

const walletSelector = useTemplateRef<HTMLDialogElement>('wallet-selector')

const query = transactionService.query()
const { state: transactions, isReady: transactionsAreReady, execute: refetchTransactions } = useAsyncState(() => query.execute(), [])

const overview = computed(() => {
  return [
    {
      label: 'Inflow',
      amount: transactions.value.filter(t => t.category.isIncome).reduce((acc, t) => acc + t.netAmountFloat, 0)
    },
    {
      label: 'Outflow',
      amount: transactions.value.filter(t => t.category.isExpense).reduce((acc, t) => acc + t.netAmountFloat, 0)
    },
    'divider' as const,
    {
      label: '',
      amount: transactions.value.reduce((acc, t) => acc + t.netAmountFloat, 0)
    }
  ]
})

const transactionsGroupedByDay = computed(() => [...Object.entries(groupBy(transactions.value, (t) => t.time.slice(0, 10)))].reverse())
const balancesByDay = computed(
  () => transactionsGroupedByDay.value.reduce((acc, [day, transactions]) =>
    acc.set(day, transactions.reduce((acc, t) => acc + t.netAmountFloat, 0))
  , new Map<string, number>()))

watch(() => [route.query.period, route.query.walletId, walletsAreReady], async ([period, walletId]) => {
  let result

  result = query.filterByPeriod(String(period))
  if (!result.success) {
    const currentMonth = dayjs().format('YYYY-MM')
    router.push({ query: { ...route.query, period: currentMonth } })
  }

  result = await query.filterByWallet(String(walletId))
  if (!result.success) {
    router.push({ query: { ...route.query, walletId: wallets.value.find(w => w.isDefault)?.id } })
  }

  refetchTransactions()
  walletSelector.value?.close()
}, { immediate: true })
</script>
