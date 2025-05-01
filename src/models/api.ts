import { type DexieOptions } from 'dexie'
import { createAppDexie, type AppDexie } from './dexie'
import SettingService from 'models/settings/SettingService'

export default class Api {
  constructor (opts: { dexieOpts?: DexieOptions } = {}) {
    this.dexie = createAppDexie(opts.dexieOpts)
    this.settings = new SettingService(this.dexie)
  }

  public readonly settings: SettingService
  private readonly dexie: AppDexie
}
