import SimpleSyncer from './SimpleSyncer'
import type { TransactionRecord, TransactionTable } from 'models/data/transactions/dexie'
import type SyncApp from '../SyncApp'
import * as v from 'valibot'

export default class TransactionSyner extends SimpleSyncer<TransactionRecord> {
  constructor (params: {
    syncApp: SyncApp,
    transactionTable: TransactionTable
  }) {
    super({ syncApp: params.syncApp })
    this.transactionTable = params.transactionTable
  }

  override getSyncUrl (): string {
    return '/transactions_sync'
  }

  override async getAllLocalRecords () {
    return await this.transactionTable.toArray()
  }

  override checkRemoteRecordSchema (payload: unknown): TransactionRecord[] {
    const schema = v.array(v.object({
      id: v.pipe(v.string(), v.minLength(1)),
      time: v.pipe(v.string(), v.minLength(1)),
      amount: v.pipe(v.number(), v.integer()),
      categoryId: v.pipe(v.string(), v.minLength(1)),
      walletId: v.pipe(v.string(), v.minLength(1)),
      hash: v.pipe(v.string(), v.minLength(1)),
    }))

    return v.parse(schema, payload) as TransactionRecord[]
  }

  override async addRecords (records: TransactionRecord[]) {
    await this.transactionTable.bulkAdd(records)
  }

  override async updateRecords (records: TransactionRecord[]) {
    const recordUpdates = records.map(r => ({
      key: r.id,
      changes: {
        time: r.time,
        amount: r.amount,
        categoryId: r.categoryId,
        walletId: r.walletId,
        hash: r.hash
      }
    }))

    await this.transactionTable.bulkUpdate(recordUpdates)
  }

  async getRecoredsByHashes (hashes: string[]): Promise<TransactionRecord[]> {
    return await this.transactionTable.where('hash').anyOf(hashes).toArray()
  }

  private readonly transactionTable: TransactionTable
}
