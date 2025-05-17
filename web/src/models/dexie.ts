import Dexie, { type DexieOptions } from 'dexie'
import {
  TRANSACTION_TABLE_INDICES,
  type TransactionTable,
} from './transactions/dexie'
import { CATEGORY_TABLE_INDICES, type CategoryTable } from './categories/dexie'
import { WALLET_TABLE_INDICES, type WalletTable } from './wallets/dexie'
import { SYNC_HASH_TABLE_INDICES, type SyncHashTable } from './sync/dexie'

export function createAppDexie (opts?: DexieOptions) {
  const d = new Dexie('Wallock Database', opts) as AppDexie

  d.version(1).stores({
    categories: CATEGORY_TABLE_INDICES,
    transactions: TRANSACTION_TABLE_INDICES,
    wallets: WALLET_TABLE_INDICES,

    syncHashes: SYNC_HASH_TABLE_INDICES,
  })

  return d
}

export type AppDexie = Dexie & {
  categories: CategoryTable;
  transactions: TransactionTable;
  wallets: WalletTable;

  syncHashes: SyncHashTable;
}
