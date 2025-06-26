import { type DexieOptions } from 'dexie'
import { createAppDexie, type AppDexie } from './dexie'
import WalletService from './data/wallets/WalletService'
import CategoryService from './data/categories/CategoryService'
import TransactionService from './data/transactions/TransactionService'
import I18n from './i18n/I18n'

export default class Api {
  constructor (opts: { dexieOpts?: DexieOptions } = {}) {
    this.dexie = createAppDexie(opts.dexieOpts)

    this.i18n = new I18n()

    this.categoryService = new CategoryService({
      categoryTable: this.dexie.categories,
    })
    this.walletService = new WalletService({
      walletTable: this.dexie.wallets,
    })
    this.transactionService = new TransactionService({
      transactionTable: this.dexie.transactions,
      categoryService: this.categoryService,
      walletService: this.walletService,
    })
  }

  public readonly categoryService: CategoryService
  public readonly transactionService: TransactionService
  public readonly walletService: WalletService

  public readonly i18n: I18n

  public readonly dexie: AppDexie
}
