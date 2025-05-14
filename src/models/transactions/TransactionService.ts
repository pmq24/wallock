import CategoryService from 'models/categories/CategoryService'
import type { AppDexie, TransactionTable } from 'models/dexie'
import WalletService from 'models/wallets/WalletService'
import TransactionCreationForm from './TransactionCreationForm'
import TransactionQuery from './TransactionQuery'
import _ from 'lodash'

export default class TransactionService {
  constructor (dexie: AppDexie) {
    this.transactionTable = dexie.transactions
    this.categoryService = new CategoryService(dexie)
    this.walletService = new WalletService(dexie)
  }

  async monthsWithTransactions () {
    const transactionTimes = (await this.transactionTable
      .orderBy('time')
      .uniqueKeys()) as string[]

    return _(transactionTimes)
      .map((time) => time.slice(0, 7))
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
