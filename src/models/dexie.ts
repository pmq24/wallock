import Dexie, { type DexieOptions, type EntityTable } from 'dexie'
import type Category from './categories/Category'
import type Setting from 'models/settings/Setting'
import type Wallet from './wallets/Wallet'

export function createAppDexie (opts?: DexieOptions) {
  const d = new Dexie('Wallock Database', opts) as AppDexie

  d.version(1).stores({
    categories: 'id, &name',
    settings: 'id',
    transactions: 'id',
    wallets: 'id, &name',
  })

  return d
}

export type AppDexie = Dexie & {
  categories: CategoryTable;
  settings: SettingTable;
  transactions: TransactionTable;
  wallets: WalletTable;
}

export type CategoryTable = EntityTable<CategoryRecord, 'id'>
export type CategoryRecord = {
  id: string;
  name: string;
  type: Category.Type;
}

export type SettingTable = EntityTable<SettingRecord, 'id'>
export type SettingRecord = {
  id: string;
  timeZone: Setting.TimeZone;
}

export type TransactionTable = EntityTable<TransactionRecord, 'id'>
export type TransactionRecord = {
  id: string;
  amount: number;
  categoryId: string;
  timestamp: number;
  walletId: string;
}

export type WalletTable = EntityTable<WalletRecord, 'id'>
export type WalletRecord = {
  id: string;
  name: string;
  currencyCode: Wallet.CurrencyCode;
}
