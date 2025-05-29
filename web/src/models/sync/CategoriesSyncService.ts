import type AuthService from './AuthService'
import SimpleSyncService from './SimpleSyncService'
import type { CategoryRecord, CategoryTable } from 'models/data/categories/dexie'

export default class CategoriesSyncService extends SimpleSyncService<CategoryRecord> {
  constructor (params: {
    authService: AuthService,
    categoryTable: CategoryTable
  }) {
    super({ authService: params.authService })
    this.categoryTable = params.categoryTable
  }

  override async getAllLocalRecords () {
    return await this.categoryTable.toArray()
  }

  override getSyncUrl (): string {
    return '/categories_sync/'
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

  getRecoredsByHashes (hashes: string[]): Promise<CategoryRecord[]> {
    return this.categoryTable.where('hash').anyOf(hashes).toArray()
  }

  private readonly categoryTable: CategoryTable
}
