import type { EntityTable } from 'dexie'

export const TRANSACTION_TABLE_INDICES = 'id, time, categoryId, walletId'

export type TransactionTable = EntityTable<TransactionRecord, 'id'>

export type TransactionRecord = {
  id: string;

  amount: number;
  time: string;

  categoryId: string;
  walletId: string;
}
