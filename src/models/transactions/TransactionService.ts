import CategoryService from 'models/categories/CategoryService'
import type { AppDexie, TransactionTable } from 'models/dexie'
import WalletService from 'models/wallets/WalletService'
import TransactionCreationForm from './TransactionCreationForm'
import TransactionQuery from './TransactionQuery'
import _ from 'lodash'
import dayjs from 'dayjs'

export default class TransactionService {
  constructor (dexie: AppDexie) {
    this.transactionTable = dexie.transactions
    this.categoryService = new CategoryService(dexie)
    this.walletService = new WalletService(dexie)
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

  async query () {
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
