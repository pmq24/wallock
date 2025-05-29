import type AuthService from './AuthService'
import { differenceBy } from 'lodash'

export default abstract class SimpleSyncService<T extends { id: string, hash: string }> {
  abstract getAllLocalRecords (): Promise<T[]>
  abstract getSyncUrl (): string
  abstract addRecords (records: T[]): Promise<void>
  abstract updateRecords (records: T[]): Promise<void>
  abstract getRecoredsByHashes (hashes: string[]): Promise<T[]>

  constructor (params: { authService: AuthService }) {
    this.authService = params.authService
  }

  async sync () {
    const localRecords = await this.getAllLocalRecords()
    const localHashes = localRecords.map(r => r.hash)

    const recordsToPull: T[] = await this.authService
      .fetchSyncApp(`${this.getSyncUrl()}/pull_to_local?hashes=${localHashes.join(' ')}`)
      .then(async (res) => res.json())

    const newRecords = differenceBy(recordsToPull, localRecords, 'id')
    this.addRecords(newRecords)
    const updatedRecords = recordsToPull.filter(r => !newRecords.includes(r))
    this.updateRecords(updatedRecords)

    const differentFromRemote: string[] = await this.authService
      .fetchSyncApp(
        `${this.getSyncUrl()}/different_from_remote?hashes=${localHashes.join(' ')}`
      )
      .then(async (res) => res.json())

    const recordsToPush = await this.getRecoredsByHashes(differentFromRemote)

    await this.authService.fetchSyncApp(
      `${this.getSyncUrl()}/push_to_remote`,
      {
        method: 'POST',
        body: JSON.stringify(recordsToPush),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  private readonly authService: AuthService
}
