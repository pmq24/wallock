import Dexie, { type DexieOptions, type EntityTable } from 'dexie'
import type Wallet from './wallets/Wallet'
import {
  TRANSACTION_TABLE_INDICES,
  type TransactionTable,
} from './transactions/dexie'
import { CATEGORY_TABLE_INDICES, type CategoryTable } from './categories/dexie'

export function createAppDexie (opts?: DexieOptions) {
  const d = new Dexie('Wallock Database', opts) as AppDexie

  d.version(1).stores({
    categories: CATEGORY_TABLE_INDICES,
    transactions: TRANSACTION_TABLE_INDICES,
    wallets: 'id, &name',
  })

  return d
}

export type AppDexie = Dexie & {
  categories: CategoryTable;
  transactions: TransactionTable;
  wallets: WalletTable;
}

export type WalletTable = EntityTable<WalletRecord, 'id'>
export type WalletRecord = {
  id: string;
  name: string;
  currencyCode: Wallet.CurrencyCode;
  isDefault: boolean;
}
