import type { EntityTable } from 'dexie'

export const HASH_TABLE_INDICES = 'name'

export type HashTable = EntityTable<HashRecord, 'name'>

export type HashRecord = {
  name: string;
  hash: string;
}
