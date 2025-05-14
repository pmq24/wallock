<template>
  <header class="navbar lg:w-xl lg:mx-auto prose">
    <h1>
      Transactions
    </h1>
  </header>

  <main class="p-2 lg:w-xl lg:mx-auto">
    <div class="overflow-x-auto">
      <nav class="tabs">
        <a
          v-for="month in monthsWithTransaction"
          :key="month"
          :class="['tab', period === month && 'tab-active']"
          :href="`?period=${month}`"
        >
          {{ month }}
        </a>
      </nav>
    </div>

    <ul class="list">
      <li
        v-for="transaction in transactions"
        :key="transaction.id"
      >
        <article>
          <a
            :href="`/transactions/${transaction.id}`"
            class="list-row"
          >
            <h1 class="list-col-grow">{{ transaction.category.name }}</h1>
            <span :class="['font-mono', transaction.category.isExpense ? 'text-error' : 'text-success']">
              {{ transaction.displayAmount }}
            </span>
          </a>
        </article>
      </li>
    </ul>
  </main>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { injectApi } from 'providers/api'

const api = injectApi()
const transactionService = api.transactions

const monthsWithTransaction = await transactionService.monthsWithTransactions()

const query = await transactionService.query()

const qs = new URLSearchParams(window.location.search)
const period = qs.get('period') ?? undefined

query.period = period
if (!query.period) {
  const currentMonth = dayjs().format('YYYY-MM')
  window.location.replace(`/transactions?period=${currentMonth}`)
}

const transactions = await query.submit()
</script>
