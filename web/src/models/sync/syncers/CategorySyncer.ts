import SimpleSyncer from './SimpleSyncer'
import type { CategoryRecord, CategoryTable } from 'models/data/categories/dexie'
import type SyncApp from '../SyncApp'
import * as v from 'valibot'
import Category from 'models/data/categories/Category'

export default class CategorySyncer extends SimpleSyncer<CategoryRecord> {
  constructor (params: {
    syncApp: SyncApp,
    categoryTable: CategoryTable
  }) {
    super({ syncApp: params.syncApp })
    this.categoryTable = params.categoryTable
  }

  override getSyncUrl (): string {
    return '/categories_sync'
  }

  override async getAllLocalRecords () {
    return await this.categoryTable.toArray()
  }

  override checkRemoteRecordSchema (payload: unknown): CategoryRecord[] {
    const schema = v.array(v.object({
      id: v.pipe(v.string(), v.minLength(1)),
      type: v.pipe(v.string(), v.values(Category.TYPES)),
      name: v.pipe(v.string(), v.minLength(1)),
      hash: v.pipe(v.string(), v.minLength(1)),
    }))

    return v.parse(schema, payload) as CategoryRecord[]
  }

  override async addRecords (records: CategoryRecord[]) {
    await this.categoryTable.bulkAdd(records)
  }

  override async updateRecords (records: CategoryRecord[]) {
    const recordUpdates = records.map(r => ({
      key: r.id,
      changes: {
        name: r.name,
        type: r.type,
        hash: r.hash
      }
    }))

    await this.categoryTable.bulkUpdate(recordUpdates)
  }

  async getRecoredsByHashes (hashes: string[]): Promise<CategoryRecord[]> {
    return await this.categoryTable.where('hash').anyOf(hashes).toArray()
  }

  private readonly categoryTable: CategoryTable
}
