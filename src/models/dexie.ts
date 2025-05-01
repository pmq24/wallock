import Dexie, { type DexieOptions, type EntityTable } from 'dexie'
import type Setting from 'models/settings/Setting'
import type Wallet from './wallets/Wallet'

export function createAppDexie (opts?: DexieOptions) {
  const d = new Dexie('Wallock Database', opts) as AppDexie

  d.version(1).stores({
    settings: 'id',
    wallets: 'id, &name',
  })

  return d
}

export type AppDexie = Dexie & {
  settings: SettingTable;
  wallets: WalletTable;
}

export type SettingTable = EntityTable<SettingRecord, 'id'>
export type SettingRecord = {
  id: string;
  timeZone: Setting.TimeZone;
}

export type WalletTable = EntityTable<WalletRecord, 'id'>
export type WalletRecord = {
  id: string;
  name: string;
  currencyCode: Wallet.CurrencyCode;
}
