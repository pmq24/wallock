import type { EntityTable } from 'dexie'

export const SYNC_HASH_TABLE_INDICES = 'name'

export type SyncHashTable = EntityTable<SyncHashRecord, 'name'>

export type SyncHashRecord = {
  name: string;
  hash: string;
}
