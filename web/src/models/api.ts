import { type DexieOptions } from 'dexie'
import { createAppDexie, type AppDexie } from './dexie'
import WalletService from './data/wallets/WalletService'
import CategoryService from './data/categories/CategoryService'
import TransactionService from './data/transactions/TransactionService'
import I18n from './i18n/I18n'
import Hasher from './sync/hashes/Hasher'
import HashService from './sync/hashes/HashService'
import SyncService from './sync/SyncService'
import AuthService from './sync/AuthService'
import RootFolderService from './sync/RootFolderService'

export default class Api {
  constructor (opts: { dexieOpts?: DexieOptions } = {}) {
    this.dexie = createAppDexie(opts.dexieOpts)

    this.hasher = new Hasher()
    this.authService = new AuthService()

    this.rootFolderService = new RootFolderService({
      authService: this.authService,
    })

    this.i18n = new I18n()

    this.categoryService = new CategoryService({
      categoryTable: this.dexie.categories,
      hasher: this.hasher,
    })
    this.walletService = new WalletService({
      walletTable: this.dexie.wallets,
      hasher: this.hasher,
    })
    this.transactionService = new TransactionService({
      transactionTable: this.dexie.transactions,
      categoryService: this.categoryService,
      walletService: this.walletService,
    })

    this.hashes = new HashService({
      hashTable: this.dexie.hashes,
      hasher: this.hasher,
      categoryService: this.categoryService,
      walletService: this.walletService,
    })
    this.syncService = new SyncService({
      authService: this.authService,
      categoryService: this.categoryService,
    })
  }

  public readonly hashes: HashService
  public readonly hasher: Hasher
  public readonly authService: AuthService
  public readonly rootFolderService: RootFolderService

  public readonly syncService: SyncService

  public readonly categoryService: CategoryService
  public readonly transactionService: TransactionService
  public readonly walletService: WalletService

  public readonly i18n: I18n

  public readonly dexie: AppDexie
}
