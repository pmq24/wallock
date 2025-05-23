import type { EntityTable } from 'dexie'
import type Category from './Category'

export const CATEGORY_TABLE_INDICES = 'id, &name, &hash'

export type CategoryTable = EntityTable<CategoryRecord, 'id'>

export type CategoryRecord = {
  id: string;
  name: string;
  type: Category.Type;
  hash: string;
}
