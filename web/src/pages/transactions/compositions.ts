import { useAsyncState } from '@vueuse/core'
import { useCommon } from 'common'

export function useTransactions () {
  const { api, route } = useCommon()
  const transactionService = api.transactionService

  const {
    state: transactions,
    isReady: transactionsAreReady,
    execute: refetchTransactions
  } = useAsyncState(() => transactionService.query.query(route.query), [])

  return { transactions, transactionsAreReady, refetchTransactions } as const
}
