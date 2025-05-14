import dayjs from 'dayjs'
import type { TransactionTable } from 'models/dexie'
import Transaction from './Transaction'
import type CategoryService from 'models/categories/CategoryService'
import type WalletService from 'models/wallets/WalletService'

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

  set period (value: TransactionQuery.PeriodFilter | undefined) {
    if (!value) {
      this._period = undefined
    } else if (TransactionQuery.MONTH_PERIOD_FILTER_REGEX.test(value)) {
      this._period = value
    } else {
      this._period = undefined
    }
  }

  get period () {
    return this._period
  }

  async submit () {
    let collection = this.transactionTable.toCollection()
    if (this._period) {
      collection = collection.filter(
        (record) =>
          this.startTimeFilter! <= record.time &&
          record.time <= this.endTimeFilter!
      )
    }

    const records = await collection.toArray()
    const categories = await this.categoryService.all()
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
}

namespace TransactionQuery {
  export type PeriodFilter = string
}

export default TransactionQuery
