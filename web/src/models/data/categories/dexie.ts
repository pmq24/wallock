import type { EntityTable } from 'dexie'

export const CATEGORY_TABLE_INDICES = 'id, &[name+parentId]'

export type CategoryTable = EntityTable<CategoryRecord, 'id'>

export type CategoryRecord = {
  id: string;
  name: string;
  parentId: string;
}
