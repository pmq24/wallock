<template>
  <WlMainNav>
    <header class="navbar lg:w-xl lg:mx-auto">
      <h1 class="text-xl font-bold flex-1">
        Transactions
      </h1>
    </header>

    <main class="p-2 lg:w-xl lg:mx-auto flex flex-col gap-2">
      <div class="overflow-x-auto">
        <nav class="tabs">
          <RouterLink
            v-for="month in months"
            :key="month"
            :class="['tab', query.period === month && 'tab-active']"
            :to="{ query: { period: month } }"
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
        v-if="isReady && !transactions.length"
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
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { groupBy } from 'lodash'
import { WlAddIcon } from 'components/icons'
import WlFormattedAmount from 'components/WlFormattedAmount.vue'

const route = useRoute()

const api = injectApi()
const transactionService = api.transactions

const months = await transactionService.visibleMonths()

const query = await transactionService.query()
const { state: transactions, isReady, execute: refetchTransactions } = useAsyncState(() => query.submit(), [])

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

watch(() => route.query.period, async (period) => {
  query.period = period as any
  if (!query.period) {
    const currentMonth = dayjs().format('YYYY-MM')
    window.location.replace(`/transactions?period=${currentMonth}`)
    query.period = currentMonth
  }

  refetchTransactions()
}, { immediate: true })
</script>
