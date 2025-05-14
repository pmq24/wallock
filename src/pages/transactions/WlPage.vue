<template>
  <WlMainNav>
    <header class="navbar lg:w-xl lg:mx-auto">
      <h1 class="text-xl font-bold flex-1">
        Transactions
      </h1>
    </header>

    <main class="p-2 lg:w-xl lg:mx-auto">
      <div class="overflow-x-auto">
        <nav class="tabs">
          <RouterLink
            v-for="month in monthsWithTransaction"
            :key="month"
            :class="['tab', query.period === month && 'tab-active']"
            :to="{ query: { period: month } }"
          >
            {{ month }}
          </RouterLink>
        </nav>
      </div>

      <ul class="list">
        <li
          v-for="transaction in transactions"
          :key="transaction.id"
        >
          <article class="list-row">
            <h1 class="list-col-grow">
              {{ transaction.category.name }}
            </h1>
            <span :class="['font-mono', transaction.category.isExpense ? 'text-error' : 'text-success']">
              {{ transaction.displayAmount }}
            </span>
          </article>
        </li>
      </ul>

      <RouterLink
        :to="{name: 'transactionsNew'}"
        class="btn btn-circle btn-primary btn-xl fixed bottom-20 right-4"
      >
        <WlAddIcon />
      </RouterLink>
    </main>
  </WlMainNav>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { injectApi } from 'providers/api'
import WlMainNav from 'components/WlMainNav/WlMainNav.vue'
import { WlAddIcon } from 'components/icons'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import type Transaction from 'models/transactions/Transaction'

const route = useRoute()

const api = injectApi()
const transactionService = api.transactions

const monthsWithTransaction = await transactionService.monthsWithTransactions()

const query = await transactionService.query()
const transactions = ref<Transaction[]>([])

watch(() => route.query.period, async (period) => {
  query.period = period as any
  if (!query.period) {
    const currentMonth = dayjs().format('YYYY-MM')
    window.location.replace(`/transactions?period=${currentMonth}`)
    query.period = currentMonth
  }

  transactions.value = await query.submit()
}, { immediate: true })
</script>
