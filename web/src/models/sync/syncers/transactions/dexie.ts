import type { EntityTable } from 'dexie'

export const TRANSACTION_HASH_TABLE_INDICES = '&period, &hash'

export type TransactionHashTable = EntityTable<TransactionHashRecord, 'period'>

export type TransactionHashRecord = {
  period: string;
  hash: string;
}
