import { type DexieOptions } from 'dexie'
import { createAppDexie, type AppDexie } from './dexie'
import WalletService from './wallets/WalletService'
import CategoryService from './categories/CategoryService'
import TransactionService from './transactions/TransactionService'
import I18n from './i18n/I18n'

export default class Api {
  constructor (opts: { dexieOpts?: DexieOptions } = {}) {
    this.dexie = createAppDexie(opts.dexieOpts)
    this.categories = new CategoryService({ api: this })
    this.transactions = new TransactionService({ api: this })
    this.wallets = new WalletService({ api: this })

    this.i18n = new I18n()
  }

  public readonly categories: CategoryService
  public readonly transactions: TransactionService
  public readonly wallets: WalletService

  public readonly i18n: I18n

  public readonly dexie: AppDexie
}
