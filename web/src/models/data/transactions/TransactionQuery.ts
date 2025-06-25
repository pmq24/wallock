import dayjs from 'dayjs'
import type { TransactionTable } from 'models/data/transactions/dexie'
import Transaction from './Transaction'
import type CategoryService from 'models/data/categories/CategoryService'
import type WalletService from 'models/data/wallets/WalletService'
import { createStandardError, createStandardSuccess } from 'models/common'
import type Wallet from 'models/data/wallets/Wallet'

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

  filterByPeriod (period: TransactionQuery.PeriodFilter | undefined) {
    if (!period) {
      this._period = undefined
      return createStandardSuccess(undefined)
    }

    if (TransactionQuery.MONTH_PERIOD_FILTER_REGEX.test(period)) {
      this._period = period
      return createStandardSuccess(period)
    }

    return createStandardError('Invalid period filter')
  }

  get periodFilter () {
    return this._period
  }

  async filterByWallet (id: string | undefined) {
    if (!id) {
      this._wallet = undefined
      return createStandardSuccess(undefined)
    }

    const wallets = await this.walletService.all()
    const wallet = wallets.find((w) => w.id === id)
    if (wallet) {
      this._wallet = wallet
      return createStandardSuccess(wallet.id)
    }

    return createStandardError('Wallet not found')
  }

  get walletFilter () {
    return this._wallet
  }

  async execute () {
    const queryObject = {} as Record<string, any>
    if (this._wallet) {
      queryObject['walletId'] = this._wallet.id
    }

    let collection
    if (Object.keys(queryObject).length > 0) {
      collection = this.transactionTable.where(queryObject)
    } else {
      collection = this.transactionTable.toCollection()
    }

    if (this._period) {
      collection = collection.filter(
        (record) =>
          this.startTimeFilter! <= record.time &&
          record.time <= this.endTimeFilter!
      )
    }

    const records = await collection.toArray()
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
          hash: record.hash
        })
    )
  }

  private get startTimeFilter () {
    if (!this._period) {
      return undefined
    } else if (TransactionQuery.MONTH_PERIOD_FILTER_REGEX.test(this._period)) {
      return dayjs(`${this._period}-01`).startOf('month').format()
    } else {
      return undefined
    }
  }

  private get endTimeFilter () {
    if (!this._period) {
      return undefined
    } else if (TransactionQuery.MONTH_PERIOD_FILTER_REGEX.test(this._period)) {
      return dayjs(`${this._period}-01`).endOf('month').format()
    } else {
      return undefined
    }
  }

  private static MONTH_PERIOD_FILTER_REGEX = /^(\d{4})-(0[1-9]|1[0-2])$/

  private readonly transactionTable: TransactionTable
  private readonly categoryService: CategoryService
  private readonly walletService: WalletService

  private _period: TransactionQuery.PeriodFilter | undefined
  private _wallet: Wallet | undefined
}

namespace TransactionQuery {
  export type PeriodFilter = string
}

export default TransactionQuery
