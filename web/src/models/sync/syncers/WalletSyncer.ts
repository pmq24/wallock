import type { WalletRecord, WalletTable } from 'models/data/wallets/dexie'
import SimpleSyncer from './SimpleSyncer'
import type SyncApp from '../SyncApp'
import * as v from 'valibot'
import Wallet from 'models/data/wallets/Wallet'

export default class WalletSyncer extends SimpleSyncer<WalletRecord> {
  constructor (params: {
    syncApp: SyncApp,
    walletTable: WalletTable
  }) {
    super({ syncApp: params.syncApp })
    this.walletTable = params.walletTable
  }

  override getSyncUrl (): string {
    return '/wallets_sync'
  }

  override async getAllLocalRecords () {
    return await this.walletTable.toArray()
  }

  override checkRemoteRecordSchema (payload: unknown): WalletRecord[] {
    const schema = v.array(v.object({
      id: v.pipe(v.string(), v.minLength(1)),
      name: v.pipe(v.string(), v.minLength(1)),
      currencyCode: v.pipe(v.string(), v.values(Wallet.CURRENCY_CODES)),
      hash: v.pipe(v.string(), v.minLength(1)),
    }))

    return v.parse(schema, payload) as WalletRecord[]
  }

  override async addRecords (records: WalletRecord[]) {
    await this.walletTable.bulkAdd(records)
  }

  override async updateRecords (records: WalletRecord[]) {
    const recordUpdates = records.map(r => ({
      key: r.id,
      changes: r
    }))

    await this.walletTable.bulkUpdate(recordUpdates)
  }

  async getRecoredsByHashes (hashes: string[]): Promise<WalletRecord[]> {
    return await this.walletTable.where('hash').anyOf(hashes).toArray()
  }

  private readonly walletTable: WalletTable
}
