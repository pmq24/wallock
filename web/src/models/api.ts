import { type DexieOptions } from 'dexie'
import { createAppDexie, type AppDexie } from './dexie'
import WalletService from './data/wallets/WalletService'
import CategoryService from './data/categories/CategoryService'
import TransactionService from './data/transactions/TransactionService'
import I18n from './i18n/I18n'
import Hasher from './sync/hashes/Hasher'
import HashService from './sync/hashes/HashService'
import AuthService from './sync/AuthService'
import RootFolderService from './sync/RootFolderService'
import SyncApp from './sync/SyncApp'
import Syncer from './sync/Syncer'
import CategorySyncer from './sync/syncers/CategorySyncer'
import WalletSyncer from './sync/syncers/WalletSyncer'
import TransactionHashService from './sync/syncers/transactions/TransactionHashService'
import TransactionSyncer from './sync/syncers/TransactionSyncer'

export default class Api {
  constructor (opts: { dexieOpts?: DexieOptions } = {}) {
    this.dexie = createAppDexie(opts.dexieOpts)

    this.hasher = new Hasher()

    this.syncApp = new SyncApp()
    this.authService = new AuthService({ syncApp: this.syncApp })

    this.rootFolderService = new RootFolderService({
      syncApp: this.syncApp
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
      hasher: this.hasher
    })
    this.transactionHashService = new TransactionHashService({
      transactionHashTable: this.dexie.transactionHashes,
      transactionService: this.transactionService,
      hasher: this.hasher
    })

    this.hashes = new HashService({
      hashTable: this.dexie.hashes,
      hasher: this.hasher,
      categoryService: this.categoryService,
      walletService: this.walletService,
    })

    this.categorySyncer = new CategorySyncer({
      categoryTable: this.dexie.categories,
      syncApp: this.syncApp
    })

    this.walletSyncer = new WalletSyncer({
      walletTable: this.dexie.wallets,
      syncApp: this.syncApp
    })

    this.transactionSyncer = new TransactionSyncer({
      transactionTable: this.dexie.transactions,
      syncApp: this.syncApp
    })

    this.syncer = new Syncer({
      categorySyncer: this.categorySyncer,
      authService: this.authService,
      walletSyncer: this.walletSyncer
    })
  }

  public readonly hashes: HashService
  public readonly hasher: Hasher
  public readonly authService: AuthService
  public readonly rootFolderService: RootFolderService

  public readonly syncApp: SyncApp
  public readonly syncer: Syncer
  public readonly categorySyncer: CategorySyncer
  public readonly walletSyncer: WalletSyncer
  public readonly transactionSyncer: TransactionSyncer

  public readonly categoryService: CategoryService
  public readonly transactionService: TransactionService
  public readonly transactionHashService: TransactionHashService
  public readonly walletService: WalletService

  public readonly i18n: I18n

  public readonly dexie: AppDexie
}
