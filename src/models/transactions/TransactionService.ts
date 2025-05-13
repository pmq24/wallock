import CategoryService from 'models/categories/CategoryService'
import type { AppDexie, TransactionTable } from 'models/dexie'
import WalletService from 'models/wallets/WalletService'
import TransactionCreationForm from './TransactionCreationForm'

export default class TransactionService {
  constructor (dexie: AppDexie) {
    this.transactionTable = dexie.transactions
    this.categoryService = new CategoryService(dexie)
    this.walletService = new WalletService(dexie)
  }

  async creationForm () {
    return TransactionCreationForm.prepare({
      transactionTable: this.transactionTable,
      categoryService: this.categoryService,
      walletService: this.walletService,
    })
  }

  private readonly transactionTable: TransactionTable

  private readonly categoryService: CategoryService
  private readonly walletService: WalletService
}
