import { type DexieOptions } from 'dexie'
import { createAppDexie, type AppDexie } from './dexie'
import SettingService from 'models/settings/SettingService'
import WalletService from './wallets/WalletService'
import CategoryService from './categories/CategoryService'

export default class Api {
  constructor (opts: { dexieOpts?: DexieOptions } = {}) {
    this.dexie = createAppDexie(opts.dexieOpts)
    this.categories = new CategoryService(this.dexie)
    this.settings = new SettingService(this.dexie)
    this.wallets = new WalletService(this.dexie)
  }

  public readonly categories: CategoryService
  public readonly settings: SettingService
  public readonly wallets: WalletService
  private readonly dexie: AppDexie
}
