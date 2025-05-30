import type { WalletRecord, WalletTable } from 'models/data/wallets/dexie'
import type AuthService from './AuthService'
import SimpleSyncService from './SimpleSyncService'

export default class WalletsSyncService extends SimpleSyncService<WalletRecord> {
  constructor (params: {
    authService: AuthService,
    walletTable: WalletTable
  }) {
    super({ authService: params.authService })
    this.walletTable = params.walletTable
  }

  override async getAllLocalRecords () {
    const r = await this.walletTable.toArray()
    return r.map(r => ({ id: r.id, name: r.name, currency_code: r.currencyCode, is_default: r.isDefault, hash: r.hash }))
  }

  override getSyncUrl (): string {
    return '/wallets_sync'
  }

  override async addRecords (records: WalletRecord[]) {
    await this
      .walletTable
      .bulkAdd(
        records.map(r => ({
          id: r.id,
          name: r.name,
          currencyCode: r.currency_code,
          hash: r.hash,
          isDefault: r.is_default
        }))
      )
  }

  override async updateRecords (records: WalletRecord[]) {
    const recordUpdates = records.map(r => ({
      key: r.id,
      changes: {
        name: r.name,
        currency_code: r.currencyCode,
        hash: r.hash
      }
    }))

    await this.walletTable.bulkUpdate(recordUpdates)
  }

  async getRecoredsByHashes (hashes: string[]): Promise<WalletRecord[]> {
    const r = await this.walletTable.where('hash').anyOf(hashes).toArray()
    return r.map(r => ({ id: r.id, name: r.name, currency_code: r.currencyCode, is_default: r.isDefault, hash: r.hash }))
  }

  private readonly walletTable: WalletTable
}
