import dayjs from 'dayjs'
import type { TransactionRecord, TransactionTable } from 'models/data/transactions/dexie'
import Transaction from './Transaction'
import type CategoryService from 'models/data/categories/CategoryService'
import type WalletService from 'models/data/wallets/WalletService'
import type Wallet from 'models/data/wallets/Wallet'
import type { Collection, InsertType } from 'dexie'

class TransactionQuery {
  constructor (params: {
    transactionTable: TransactionTable;
    categoryService: CategoryService;
    walletService: WalletService;
  }) {
    this.transactionTable = params.transactionTable
    this.categoryService = params.categoryService
    this.walletService = params.walletService
  }

  async query (condition: TransactionQuery.QueryCondition) {
    let transactions
    transactions = await this.createInitialQuery(condition)
    transactions = this.queryByPeriod(transactions, condition)
    const records = await transactions.toArray()

    if (!records.length) {
      return []
    } else {
      const categories = await this.categoryService.getAll()
      const wallets = await this.walletService.all()

      return records.map(
        (record) =>
          new Transaction({
            id: record.id,
            amount: record.amount,
            time: record.time,
            category: categories.find((c) => c.id === record.categoryId)!,
            wallet: wallets.find((w) => w.id === record.walletId)!,
          })
      )
    }
  }

  private async createInitialQuery (condition: TransactionQuery.QueryCondition) {
    const q = {} as Record<string, any>

    if (condition.walletId) {
      const wallets = await this.getAllWallets()
      if (wallets.find(w => w.id === condition.walletId)) {
        q.walletId = condition.walletId
      } else {
        console.warn(`Wallet not found: ${condition.walletId}. Falling back to all wallets.`)
      }
    }

    if (Object.keys(q).length) {
      return this.transactionTable.where(q)
    } else {
      return this.transactionTable.toCollection()
    }
  }

  private queryByPeriod (
    transactions: Collection<TransactionRecord, string, InsertType<TransactionRecord, 'id'>>,
    condition: TransactionQuery.QueryCondition
  ) {
    const period = condition.period

    if (!period) {
      return transactions
    } else if (period === 'to-today') {
      const to = dayjs().endOf('day').format()
      return transactions.filter((record) => record.time <= to)
    } else if (period === 'future') {
      const from = dayjs().add(1, 'month').startOf('month').format()
      return transactions.filter((record) => from <= record.time)
    } else if (TransactionQuery.MONTH_PERIOD_FILTER_REGEX.test(period)) {
      const today = dayjs().endOf('month').format()

      const firstDayOfMonth = dayjs(`${period}-01`)
      const from = firstDayOfMonth.startOf('month').format()

      const tempTo = firstDayOfMonth.endOf('month').format()
      const to = tempTo < today ? tempTo : today
      return transactions.filter((record) => from <= record.time && record.time <= to)
    } else {
      console.warn(`Unknown period filter: ${period}. Falling back to the current month.`)
      const today = dayjs()
      const from = today.startOf('month').format()
      const to = today.endOf('day').format()
      return transactions.filter((record) => from <= record.time && record.time <= to)
    }
  }

  private async getAllWallets () {
    if (this._wallets) {
      return this._wallets
    } else {
      this._wallets = await this.walletService.all()
      return this._wallets
    }
  }

  private static MONTH_PERIOD_FILTER_REGEX = /^(\d{4})-(0[1-9]|1[0-2])$/

  private readonly transactionTable: TransactionTable
  private readonly categoryService: CategoryService
  private readonly walletService: WalletService

  private _wallets: Wallet[] | undefined
}

namespace TransactionQuery {
  export type QueryCondition = {
    period?: string
    walletId?: string
  }
}

export default TransactionQuery
