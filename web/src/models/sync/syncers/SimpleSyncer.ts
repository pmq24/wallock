import { differenceBy } from 'lodash'
import type SyncApp from '../SyncApp'
import * as v from 'valibot'

export default abstract class SimpleSyncer<T extends { id: string, hash: string }> {
  abstract getSyncUrl (): string

  abstract getAllLocalRecords (): Promise<T[]>

  abstract checkRemoteRecordSchema (payload: unknown): T[]
  abstract addRecords (records: T[]): Promise<void>
  abstract updateRecords (records: T[]): Promise<void>

  abstract getRecoredsByHashes (hashes: string[]): Promise<T[]>

  constructor (params: { syncApp: SyncApp }) {
    this.syncApp = params.syncApp
  }

  async sync () {
    const localRecords = await this.getAllLocalRecords()
    const localHashes = localRecords.map(r => r.hash)

    const { payload: pullToLocalPayload } = await this.syncApp
      .fetch(`${this.getSyncUrl()}/pull_to_local?hashes=${localHashes.join(' ')}`)
    const recordsToPull = this.checkRemoteRecordSchema(pullToLocalPayload)

    if (recordsToPull.length > 0) {
      const newRecords = differenceBy(recordsToPull, localRecords, 'id')
      this.addRecords(newRecords)
      const updatedRecords = recordsToPull.filter(r => !newRecords.includes(r))
      this.updateRecords(updatedRecords)
    }

    const { payload: differentFromRemotePayload } = await this
      .syncApp
      .fetch(`${this.getSyncUrl()}/different_from_remote?hashes=${localHashes.join(' ')}`)
    const differentFromRemote = this.checkDifferentFromRemoteResponseSchema(differentFromRemotePayload)
    const recordsToPush = await this.getRecoredsByHashes(differentFromRemote)

    if (recordsToPush.length > 0) {
      await this.syncApp.fetch(
        `${this.getSyncUrl()}/push_to_remote`,
        { method: 'POST', body: recordsToPush }
      )
    }
  }

  private checkDifferentFromRemoteResponseSchema (payload: unknown) {
    const schema = v.array(v.string())

    return v.parse(schema, payload)
  }

  private readonly syncApp: SyncApp
}
