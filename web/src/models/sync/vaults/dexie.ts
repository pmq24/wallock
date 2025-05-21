import type { EntityTable } from 'dexie'

export const VAULT_TABLE_INDICES = 'id'

export type VaultTable = EntityTable<VaultRecord, 'id'>

export type VaultRecord = {
  id: string;
  remoteId: string;
}
