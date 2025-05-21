import Dexie, { type DexieOptions } from 'dexie'
import {
  TRANSACTION_TABLE_INDICES,
  type TransactionTable,
} from './data/transactions/dexie'
import {
  CATEGORY_TABLE_INDICES,
  type CategoryTable,
} from './data/categories/dexie'
import { WALLET_TABLE_INDICES, type WalletTable } from './data/wallets/dexie'
import { HASH_TABLE_INDICES, type HashTable } from './sync/hashes/dexie'
import { VAULT_TABLE_INDICES, type VaultTable } from './sync/vaults/dexie'

export function createAppDexie (opts?: DexieOptions) {
  const d = new Dexie('Wallock Database', opts) as AppDexie

  d.version(1).stores({
    categories: CATEGORY_TABLE_INDICES,
    transactions: TRANSACTION_TABLE_INDICES,
    wallets: WALLET_TABLE_INDICES,

    hashes: HASH_TABLE_INDICES,

    vaults: VAULT_TABLE_INDICES,
  })

  return d
}

export type AppDexie = Dexie & {
  categories: CategoryTable;
  transactions: TransactionTable;
  wallets: WalletTable;

  hashes: HashTable;

  vaults: VaultTable;
}
