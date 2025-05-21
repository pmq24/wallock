import { type DexieOptions } from 'dexie'
import { createAppDexie, type AppDexie } from './dexie'
import WalletService from './data/wallets/WalletService'
import CategoryService from './data/categories/CategoryService'
import TransactionService from './data/transactions/TransactionService'
import I18n from './i18n/I18n'
import Hasher from './sync/hashes/Hasher'
import HashService from './sync/hashes/HashService'
import SyncService from './sync/SyncService'
import AuthService from './sync/auth/AuthService'
import VaultService from './sync/vaults/VaultService'

export default class Api {
  constructor (opts: { dexieOpts?: DexieOptions } = {}) {
    this.dexie = createAppDexie(opts.dexieOpts)

    this.hasher = new Hasher()
    this.authService = new AuthService()
    this.vaultService = new VaultService({
      vaultTable: this.dexie.vaults,
      authService: this.authService,
    })

    this.sync = new SyncService({
      vaultService: this.vaultService,
      authService: this.authService,
    })

    this.i18n = new I18n()

    this.categories = new CategoryService({
      categoryTable: this.dexie.categories,
      hasher: this.hasher,
    })
    this.wallets = new WalletService({
      walletTable: this.dexie.wallets,
      hasher: this.hasher,
    })
    this.transactions = new TransactionService({
      transactionTable: this.dexie.transactions,
      categoryService: this.categories,
      walletService: this.wallets,
    })

    this.hashes = new HashService({
      hashTable: this.dexie.hashes,
      hasher: this.hasher,
      categoryService: this.categories,
      walletService: this.wallets,
    })
  }

  public readonly hashes: HashService
  public readonly hasher: Hasher
  public readonly authService: AuthService
  public readonly vaultService: VaultService

  public readonly sync: SyncService

  public readonly categories: CategoryService
  public readonly transactions: TransactionService
  public readonly wallets: WalletService

  public readonly i18n: I18n

  public readonly dexie: AppDexie
}
