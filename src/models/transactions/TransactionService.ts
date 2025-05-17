import CategoryService from 'models/categories/CategoryService'
import type { TransactionTable } from 'models/dexie'
import WalletService from 'models/wallets/WalletService'
import TransactionCreationForm from './TransactionCreationForm'
import TransactionQuery from './TransactionQuery'
import _ from 'lodash'
import dayjs from 'dayjs'
import type Api from 'models/api'

export default class TransactionService {
  constructor (params: { api: Api }) {
    this.transactionTable = params.api.dexie.transactions
    this.categoryService = new CategoryService(params.api.dexie)
    this.walletService = new WalletService(params.api.dexie)
  }

  /**
   * All the months that has transactions, plus the current month and 2 before
   */
  async visibleMonths () {
    const transactionTimes = (await this.transactionTable
      .orderBy('time')
      .uniqueKeys()) as string[]

    const today = dayjs()
    const mostRecentMonths = [
      today.format('YYYY-MM'),
      today.subtract(1, 'month').format('YYYY-MM'),
      today.subtract(2, 'month').format('YYYY-MM'),
    ]

    return _(transactionTimes)
      .map((time) => time.slice(0, 7))
      .concat(mostRecentMonths)
      .sort()
      .sortedUniq()
      .value()
  }

  query () {
    return new TransactionQuery({
      transactionTable: this.transactionTable,
      categoryService: this.categoryService,
      walletService: this.walletService,
    })
  }

  async creationForm () {
    return TransactionCreationForm.create({
      transactionTable: this.transactionTable,
      categoryService: this.categoryService,
      walletService: this.walletService,
    })
  }

  private readonly transactionTable: TransactionTable

  private readonly categoryService: CategoryService
  private readonly walletService: WalletService
}
